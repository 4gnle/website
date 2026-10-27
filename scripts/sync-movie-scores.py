#!/usr/bin/env python3
"""Refresh IMDb ratings and optionally Metascores, then regenerate the gallery.

python3 scripts/sync-movie-scores.py
python3 scripts/sync-movie-scores.py --metascores

Metascores require OMDB_API_KEY in the environment or .env.local. Only movie IDs
are sent to OMDb. Keys are never included in generated files or subprocess args.
Up to 1,000 OMDb requests per rolling 24 hours; missing scores first, then scores
older than 28 days. Successes (including N/A) are cached; API errors stop requests.
"""
import argparse
import csv
from datetime import datetime, timedelta, timezone
import fcntl
import gzip
import json
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from importlib import import_module
write_json = import_module('sync-movies').write_json


def omdb_key():
    key = os.environ.get('OMDB_API_KEY')
    if key:
        return key
    env_path = ROOT / '.env.local'
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            name, separator, value = line.strip().removeprefix('export ').partition('=')
            if separator and name.strip() == 'OMDB_API_KEY':
                return value.strip().strip('"\'')
    return None


def refresh_imdb(movie_ids, ratings_file=None):
    with tempfile.TemporaryDirectory(prefix='4gnle-scores-') as directory:
        source = Path(ratings_file) if ratings_file else Path(directory) / 'ratings.tsv.gz'
        if not ratings_file:
            print('Downloading IMDb public ratings dataset…', flush=True)
            subprocess.run([
                'curl', '--fail', '--silent', '--show-error', '--location', '--max-time', '180',
                '--output', str(source), 'https://datasets.imdbws.com/title.ratings.tsv.gz',
            ], check=True)
        scores = {}
        with gzip.open(source, 'rt', encoding='utf-8', newline='') as stream:
            for row in csv.DictReader(stream, delimiter='\t'):
                if row['tconst'] in movie_ids:
                    scores[row['tconst']] = float(row['averageRating'])
        if not scores:
            raise ValueError('IMDb dataset returned no matching ratings; existing scores were preserved.')
        write_json(ROOT / 'data/imdb-scores.json', scores)
        print(f'Updated {len(scores)}/{len(movie_ids)} IMDb ratings.', flush=True)


def refresh_metascores(movie_ids, limit=1000, refresh_days=28):
    key = omdb_key()
    if not key:
        raise ValueError('Set OMDB_API_KEY in .env.local or your environment to import Metascores.')
    path = ROOT / 'data/metascores.json'
    scores = json.loads(path.read_text()) if path.exists() else {}
    state_path = ROOT / 'data/metascore-sync.json'
    state = json.loads(state_path.read_text()) if state_path.exists() else {'checkedAt': {}, 'requests': []}
    now = datetime.now(timezone.utc)
    def parse_date(value):
        return datetime.fromisoformat(value.replace('Z', '+00:00'))
    state['requests'] = [stamp for stamp in state.get('requests', [])
                         if parse_date(stamp) > now - timedelta(hours=24)]
    checked = state.setdefault('checkedAt', {})
    ordered_ids = list(dict.fromkeys(movie_ids))
    order = {title_id: index for index, title_id in enumerate(ordered_ids)}
    pending = [title_id for title_id in ordered_ids if title_id not in scores
               or title_id not in checked
               or parse_date(checked[title_id]) <= now - timedelta(days=refresh_days)]
    pending.sort(key=lambda title_id: (title_id in scores, checked.get(title_id, ''), order[title_id]))
    remaining_budget = max(0, 1000 - len(state['requests']))
    pending = pending[:min(limit, remaining_budget)]
    print(f'{len(pending)} Metascore requests planned; {remaining_budget}/1000 requests remain in the local 24-hour budget.', flush=True)
    for count, title_id in enumerate(pending, 1):
        url = 'https://www.omdbapi.com/?' + urlencode({'apikey': key, 'i': title_id})
        for attempt in range(3):
            if len(state['requests']) >= 1000:
                print('Local 24-hour request budget reached; saved progress is ready for the next run.', flush=True)
                return
            state['requests'].append(datetime.now(timezone.utc).isoformat())
            write_json(state_path, state)
            result = subprocess.run([
                'curl', '--silent', '--show-error', '--max-time', '20', '--config', '-',
                '--write-out', '\n%{http_code}',
            ], input='url = ' + json.dumps(url) + '\n', capture_output=True, text=True)
            if result.returncode == 0:
                break
            if attempt == 2:
                raise ValueError('OMDb request failed after three attempts; cached scores were preserved. Rerun to retry.')
            print('Transient OMDb network error; retrying the same title within the daily budget.', flush=True)
            time.sleep(2 * (attempt + 1))
        body, status = result.stdout.rsplit('\n', 1)
        payload = json.loads(body)
        if status != '200' or payload.get('Response') != 'True':
            error = payload.get('Error', '').lower()
            if 'limit' in error:
                raise ValueError('OMDb daily quota reached; cached progress is saved. Retry after the quota resets.')
            if 'api key' in error:
                raise ValueError('OMDb rejected the configured API key. Verify the key and its activation email.')
            raise ValueError(f'OMDb returned HTTP {status}; stopping requests and preserving the cache.')
        if payload.get('Response') != 'True' or payload.get('imdbID') != title_id:
            raise ValueError('OMDb could not return the requested title. Check the API key and quota; cache preserved.')
        raw_score = payload.get('Metascore')
        score = int(raw_score) if str(raw_score).isdigit() else None
        if score is not None and not 0 <= score <= 100:
            raise ValueError('OMDb returned an invalid Metascore; cache preserved.')
        scores[title_id] = score
        write_json(path, scores)
        checked[title_id] = datetime.now(timezone.utc).isoformat()
        write_json(state_path, state)
        if count % 50 == 0 or count == len(pending):
            print(f'Imported {count}/{len(pending)} Metascores.', flush=True)
        time.sleep(0.25)


def run():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--metascores', action='store_true', help='Fetch missing or stale Metascores from OMDb')
    parser.add_argument('--ratings-file', help='Use a downloaded IMDb title.ratings.tsv.gz instead of downloading it')
    parser.add_argument('--limit', type=int, default=1000, help='Maximum OMDb requests this run (1–1000; shared 24-hour cap still applies)')
    parser.add_argument('--refresh-days', type=int, default=28, help='Refresh cached Metascores after this many days')
    args = parser.parse_args()
    if not 1 <= args.limit <= 1000 or args.refresh_days < 1:
        parser.error('--limit must be 1–1000 and --refresh-days must be positive')
    movies = json.loads((ROOT / 'data/movies.json').read_text())
    movie_ids = list(dict.fromkeys(movie['id'] for movie in movies))
    error = None
    try:
        refresh_imdb(set(movie_ids), args.ratings_file)
        if args.metascores:
            refresh_metascores(movie_ids, args.limit, args.refresh_days)
    except (ValueError, subprocess.SubprocessError, OSError) as exc:
        error = str(exc)
    finally:
        # Make all successfully imported values available even if a quota interrupts a run.
        subprocess.run([sys.executable, str(ROOT / 'scripts/sync-movies.py'), '--cached-only'], check=True)
    if error:
        print(error, file=sys.stderr)
        raise SystemExit(1)


def main():
    # Prevent concurrent local runs from spending the same saved request budget.
    with (ROOT / '.movie-scores.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise SystemExit('A movie-score import is already running.')
        run()


if __name__ == '__main__':
    main()
