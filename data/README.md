# Movie catalog

`movies.json` is the generated catalog used by `/movies`. Your rating and date
come from `public/IMDbRatings.UserRatings.csv`; titles, years, title types, and
poster URLs come from IMDb's public title suggestions.

To refresh after replacing the CSV:

```sh
python3 scripts/sync-movies.py
npm run build
```

The sync requests only IMDb title IDs rated 7 or higher. It caches successful
lookups in `imdb-titles.json`, matches the exact requested ID, and includes only
entries classified by IMDb as `movie`. Series, episodes, and other title types
are excluded. Missing posters get a text fallback in the gallery. Failed title
lookups are reported and retried on the next run.

`movies-status.json` records import coverage. The page shows a partial-collection
notice if lookups are still pending. Requests are spaced at least 1.1 seconds
apart; HTTP 429 stops the importer immediately, preserving the cache. Wait for
IMDb's rate limit to clear before retrying. Use `--cached-only` to regenerate the
catalog without network requests.

The page uses a local snapshot: it does not sync your IMDb account automatically.

The gallery supports exact rating filters (All, 10, 9, 8, 7), title/year search,
and a random picker using the current filters. Search (`q`), sorting (`sort`),
rating (`rating`), and pagination (`page`) are saved in the URL. Copy link shares
that view; browser Back/Forward restores previous views. These controls make no
IMDb or OMDb requests. Run `npm run test:movies` for the gallery state tests.

## IMDb ratings and Metascores

After syncing your ratings export, refresh the public IMDb scores with:

```sh
python3 scripts/sync-movie-scores.py
```

This downloads IMDb's official `title.ratings.tsv.gz` and stores scores only for
the movies in this gallery in `imdb-scores.json`. All matching happens locally.
`sync-movies.py` preserves those scores when regenerating `movies.json`.

To import Metascores, configure `OMDB_API_KEY` in the environment or the ignored
`.env.local` file, then run:

```sh
python3 scripts/sync-movie-scores.py --metascores
npm run build
```

The OMDb import sends only movie IDs to `https://www.omdbapi.com/` and caches
results in `metascores.json`. The API key is passed through stdin to curl and is
never embedded in the website or generated data. Missing scores are imported
first, following the gallery's rating order; cached scores (including N/A) become
eligible for refresh after 28 days. If a request or quota fails, the importer
stops and preserves all completed lookups; rerun to resume. Missing scores display
`N/A`, not zero.

## Scheduled refresh

Run `npm run movies:refresh` locally. The script makes at most **1,000 OMDb
requests per rolling 24 hours**, shared across reruns using
`metascore-sync.json`. Failed requests count toward the budget as well. Keep this
file alongside the score cache when committing or deploying updates. Calls made
with this key outside the importer are not tracked; OMDb may stop the run earlier
if the provider's quota has already been consumed. Visitors make no API calls.
Transient network failures retry up to three times per title, with each attempt
counted toward the same cap. Authentication and API quota errors stop the run.

`.github/workflows/refresh-movie-scores.yml` schedules this command daily at
06:17 UTC and also supports manual runs. It builds the site before committing
generated data and the request budget to the default branch. A connected hosting
Git integration can deploy that commit; the workflow itself does not configure
or invoke hosting deployments.

To activate the schedule, push the workflow to the default branch and add
`OMDB_API_KEY` as a GitHub Actions repository secret. The ignored local
`.env.local` is not available on GitHub. The bot also needs permission to push
the generated-data commit to the default branch. No secret is committed.

Metascores appear as pills: green for 70–100, orange for 30–69, and red for
0–29. Green and orange pills use black text; red pills use white text for contrast.

Metascore links use Metacritic's `/movie/title-slug/` format. Verified exceptions
for remakes are in `lib/movie-links.ts`; add an IMDb-ID override there when a
movie uses an unusual slug. The default is derived from the movie title, so
unverified exceptions can require correction; these are not a fully audited
catalog of Metacritic URLs.
