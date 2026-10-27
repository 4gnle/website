import importlib.util
import json
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

spec = importlib.util.spec_from_file_location('scores', Path(__file__).with_name('sync-movie-scores.py'))
scores = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scores)


class MetascoreRefreshTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.root = Path(self.directory.name)
        (self.root / 'data').mkdir()
        self.root_patch = patch.object(scores, 'ROOT', self.root)
        self.root_patch.start()
        self.key_patch = patch.object(scores, 'omdb_key', return_value='test-key')
        self.key_patch.start()
        self.sleep_patch = patch.object(scores.time, 'sleep')
        self.sleep_patch.start()
        self.now = datetime.now(timezone.utc)
        self.requested = []

    def tearDown(self):
        self.root_patch.stop()
        self.key_patch.stop()
        self.sleep_patch.stop()
        self.directory.cleanup()

    def write(self, name, value):
        (self.root / 'data' / name).write_text(json.dumps(value))

    def read(self, name):
        return json.loads((self.root / 'data' / name).read_text())

    def response(self, *args, **kwargs):
        self.assertNotIn('test-key', str(args))
        url = json.loads(kwargs['input'].removeprefix('url = ').strip())
        query = parse_qs(urlparse(url).query)
        self.assertEqual(set(query), {'apikey', 'i'})
        title_id = query['i'][0]
        self.requested.append(title_id)
        payload = {'Response': 'True', 'imdbID': title_id, 'Metascore': '70'}
        return SimpleNamespace(returncode=0, stdout=json.dumps(payload) + '\n200')

    def test_missing_before_stale_and_fresh_skipped(self):
        self.write('metascores.json', {'stale': 60, 'fresh': None})
        self.write('metascore-sync.json', {
            'checkedAt': {'stale': (self.now - timedelta(days=30)).isoformat(), 'fresh': self.now.isoformat()},
            'requests': [],
        })
        with patch.object(scores.subprocess, 'run', side_effect=self.response):
            scores.refresh_metascores(['stale', 'fresh', 'new'], limit=2)
        self.assertEqual(self.requested, ['new', 'stale'])
        self.assertIsNone(self.read('metascores.json')['fresh'])

    def test_daily_cap_shared_across_reruns(self):
        self.write('metascore-sync.json', {'checkedAt': {}, 'requests': [self.now.isoformat()] * 999})
        with patch.object(scores.subprocess, 'run', side_effect=self.response):
            scores.refresh_metascores(['a', 'b'])
            scores.refresh_metascores(['a', 'b'])
        self.assertEqual(self.requested, ['a'])
        self.assertEqual(len(self.read('metascore-sync.json')['requests']), 1000)

    def test_old_requests_expire_and_run_limit_is_obeyed(self):
        self.write('metascore-sync.json', {
            'checkedAt': {}, 'requests': [(self.now - timedelta(hours=25)).isoformat()] * 1000,
        })
        with patch.object(scores.subprocess, 'run', side_effect=self.response):
            scores.refresh_metascores(['a', 'b'], limit=1)
        self.assertEqual(self.requested, ['a'])
        self.assertEqual(len(self.read('metascore-sync.json')['requests']), 1)

    def test_api_quota_stops_without_losing_cached_scores(self):
        self.write('metascores.json', {'cached': 99})
        error = SimpleNamespace(returncode=0, stdout='{"Response":"False","Error":"Request limit reached!"}\n401')
        with patch.object(scores.subprocess, 'run', return_value=error) as request:
            with self.assertRaisesRegex(ValueError, 'daily quota'):
                scores.refresh_metascores(['a', 'b'])
        self.assertEqual(request.call_count, 1)
        self.assertEqual(self.read('metascores.json'), {'cached': 99})
        self.assertEqual(len(self.read('metascore-sync.json')['requests']), 1)

    def test_network_retries_count_toward_daily_cap(self):
        self.write('metascore-sync.json', {'checkedAt': {}, 'requests': [self.now.isoformat()] * 999})
        failure = SimpleNamespace(returncode=28, stdout='')
        with patch.object(scores.subprocess, 'run', return_value=failure) as request:
            scores.refresh_metascores(['a', 'b'])
        self.assertEqual(request.call_count, 1)
        self.assertEqual(len(self.read('metascore-sync.json')['requests']), 1000)
        self.assertFalse((self.root / 'data/metascores.json').exists())

    def test_transient_network_failure_recovers(self):
        responses = [SimpleNamespace(returncode=28, stdout=''), SimpleNamespace(
            returncode=0, stdout='{"Response":"True","imdbID":"a","Metascore":"80"}\n200')]
        with patch.object(scores.subprocess, 'run', side_effect=responses):
            scores.refresh_metascores(['a'])
        self.assertEqual(self.read('metascores.json'), {'a': 80})
        self.assertEqual(len(self.read('metascore-sync.json')['requests']), 2)


if __name__ == '__main__':
    unittest.main()
