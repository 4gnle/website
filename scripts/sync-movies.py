#!/usr/bin/env python3
"""Enrich IMDb ratings with public title details; run python3 scripts/sync-movies.py.

Caches successful lookups in data/imdb-titles.json. Only missing IDs are requested
on later runs. No ratings, dates, or profile identifiers are sent to IMDb.
"""
import argparse
import csv
import json
import subprocess
import time
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'data/imdb-titles.json'
OUTPUT = ROOT / 'data/movies.json'


def write_json(path, value):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)


class RateLimited(Exception):
    pass


def lookup(title_id):
    for attempt in range(3):
        try:
            result = subprocess.run(
                ['curl', '--silent', '--show-error', '--max-time', '20', '--write-out', '\n%{http_code}',
                 f'https://v3.sg.media-imdb.com/suggestion/x/{title_id}.json'],
                capture_output=True, text=True, check=True,
            )
            body, status = result.stdout.rsplit('\n', 1)
            if status == '429':
                raise RateLimited()
            if status != '200':
                raise ValueError(f'HTTP {status}')
            title = next((item for item in json.loads(body).get('d', [])
                          if item.get('id') == title_id), None)
            if title:
                return title_id, {
                    'title': title['l'], 'type': title.get('qid', title.get('q')),
                    'year': title.get('y'), 'poster': title.get('i', {}).get('imageUrl'),
                }
        except (subprocess.SubprocessError, ValueError, KeyError):
            pass
        time.sleep(attempt + 1)
    return title_id, None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cached-only', action='store_true', help='Generate from cached data without network requests')
    args = parser.parse_args()
    with (ROOT / 'public/IMDbRatings.UserRatings.csv').open(encoding='utf-8-sig', newline='') as source:
        ratings = [row for row in csv.DictReader(source) if int(row['Rating']) >= 7]
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    imdb_scores_path = ROOT / 'data/imdb-scores.json'
    metascores_path = ROOT / 'data/metascores.json'
    imdb_scores = json.loads(imdb_scores_path.read_text()) if imdb_scores_path.exists() else {}
    metascores = json.loads(metascores_path.read_text()) if metascores_path.exists() else {}
    pending = sorted({row['Title ID'] for row in ratings} - cache.keys())
    print(f'{len(ratings)} qualifying ratings; {len(pending)} title lookups needed.', flush=True)
    if not args.cached_only:
        for count, title_id in enumerate(pending, 1):
            try:
                _, details = lookup(title_id)
            except RateLimited:
                print('IMDb returned HTTP 429. Stopping requests; retry later using the cache.', flush=True)
                break
            if details:
                cache[title_id] = details
            write_json(CACHE, cache)
            if count % 50 == 0 or count == len(pending):
                print(f'Attempted {count}/{len(pending)}; {len(cache)} titles cached.', flush=True)
            time.sleep(1.1)
    movies = []
    for row in ratings:
        title_id = row['Title ID']
        details = cache.get(title_id)
        if details and details['type'] == 'movie':
            poster = details['poster']
            if poster:
                poster = poster.replace('._V1_', '._V1_QL75_UX480_')
            movies.append({
                'id': title_id, 'title': details['title'], 'year': details['year'],
                'rating': int(row['Rating']), 'ratedAt': row['Last Modified Date'],
                'poster': poster,
                'imdbRating': imdb_scores.get(title_id),
                'metascore': metascores.get(title_id),
            })
    movies.sort(key=lambda movie: (-movie['rating'], movie['title'].casefold(), movie['id']))
    write_json(OUTPUT, movies)
    print(f'Saved {len(movies)} movies. Types: {dict(Counter(cache[row["Title ID"]]["type"] for row in ratings if row["Title ID"] in cache))}', flush=True)
    unresolved = sorted({row['Title ID'] for row in ratings} - cache.keys())
    write_json(ROOT / 'data/movies-status.json', {
        'qualifyingTitles': len(ratings), 'resolvedTitles': len(ratings) - len(unresolved),
        'pendingTitles': len(unresolved), 'movies': len(movies),
    })
    if unresolved:
        print(f'{len(unresolved)} unresolved IDs remain; rerun to retry.', flush=True)
        if not args.cached_only:
            raise SystemExit(1)


if __name__ == '__main__':
    main()
