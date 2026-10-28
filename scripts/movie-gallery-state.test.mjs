import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  readGalleryState,
  writeGalleryState,
  filterMovies,
  moviePage,
  pickMovie,
} from '../lib/movie-gallery-state.ts';

const movies = JSON.parse(
  fs.readFileSync(new URL('../data/movies.json', import.meta.url), 'utf8'),
);
const defaults = { search: '', sort: 'recent', rating: 'all', page: 1 };

test('shared views round-trip with Unicode, rating, sorting and page', () => {
  const state = { search: 'mamá & 2001', sort: 'rating', rating: '9', page: 3 };
  const query = writeGalleryState('?utm_source=friend', state);
  assert.deepEqual(readGalleryState(query), state);
  assert.equal(new URLSearchParams(query).get('utm_source'), 'friend');
  assert.equal(writeGalleryState(query, defaults), 'utm_source=friend');
});

test('malformed URL state falls back safely', () => {
  for (const page of [
    '-2',
    'NaN',
    'Infinity',
    '9007199254740993',
    '1.5',
    '1e4',
    '0',
  ]) {
    assert.equal(readGalleryState(`?page=${page}`).page, 1);
  }
  assert.deepEqual(readGalleryState('?sort=oops&rating=6'), defaults);
  assert.equal(readGalleryState(`?q=${'a'.repeat(500)}`).search.length, 200);
});

test('rating and title/year search intersect without changing the catalog', () => {
  const originalOrder = movies.map((movie) => movie.id);
  const expected = movies.filter(
    (movie) =>
      movie.rating === 9 &&
      `${movie.title} ${movie.year}`.toLowerCase().includes('2001'),
  );
  const result = filterMovies(movies, {
    ...defaults,
    rating: '9',
    search: '2001',
  });
  assert.deepEqual(
    new Set(result.map((movie) => movie.id)),
    new Set(expected.map((movie) => movie.id)),
  );
  assert.deepEqual(
    movies.map((movie) => movie.id),
    originalOrder,
  );
  assert.equal(
    filterMovies(movies, { ...defaults, search: 'zzzz-no-movie-xxxx' }).length,
    0,
  );
});

test('highest rating uses most recent rating date for ties', () => {
  const result = filterMovies(movies, { ...defaults, sort: 'rating' });
  for (let i = 1; i < result.length; i++) {
    assert.ok(result[i - 1].rating >= result[i].rating);
    if (result[i - 1].rating === result[i].rating) {
      assert.ok(
        Date.parse(result[i - 1].ratedAt) >= Date.parse(result[i].ratedAt),
      );
    }
  }
});

test('recently rated is the default order', () => {
  const result = filterMovies(movies, readGalleryState(''));
  assert.equal(
    result[0].ratedAt,
    movies.reduce(
      (latest, movie) =>
        Date.parse(movie.ratedAt) > Date.parse(latest) ? movie.ratedAt : latest,
      movies[0].ratedAt,
    ),
  );
});

test('desktop/mobile pagination covers all movies and clamps invalid pages', () => {
  for (const pageSize of [40, 8]) {
    const { totalPages } = moviePage(movies.length, 1, pageSize);
    const allIds = [];
    for (let page = 1; page <= totalPages; page++) {
      const { start } = moviePage(movies.length, page, pageSize);
      allIds.push(
        ...movies.slice(start, start + pageSize).map((movie) => movie.id),
      );
    }
    assert.equal(allIds.length, movies.length);
    assert.equal(new Set(allIds).size, movies.length);
    assert.equal(moviePage(movies.length, 99999, pageSize).page, totalPages);
  }
  assert.deepEqual(moviePage(0, 100, 40), { page: 1, totalPages: 1, start: 0 });
});

test('random picks respect filters, avoid immediate repeats, and handle zero/one result', () => {
  const pool = filterMovies(movies, { ...defaults, rating: '10' });
  const first = pickMovie(pool, undefined, 0);
  const next = pickMovie(pool, first.id, 0);
  assert.equal(first.rating, 10);
  assert.equal(next.rating, 10);
  assert.notEqual(first.id, next.id);
  assert.equal(pickMovie([], undefined, 0), null);
  assert.equal(pickMovie([first], first.id, 0), first);
  assert.equal(pickMovie(pool, undefined, 0.999999), pool.at(-1));
});
