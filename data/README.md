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
