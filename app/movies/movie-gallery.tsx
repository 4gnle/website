'use client';

import Image from 'next/image';
import { metacriticMovieUrl } from '@/lib/movie-links';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Shuffle } from 'lucide-react';
import {
  filterMovies,
  moviePage,
  pickMovie,
  readGalleryState,
  writeGalleryState,
  type GalleryState,
  type GallerySort,
  type GalleryRating,
} from '@/lib/movie-gallery-state';
import styles from './movies.module.css';

export type Movie = {
  id: string;
  title: string;
  year: number | null;
  rating: number;
  ratedAt: string;
  poster: string | null;
  imdbRating: number | null;
  metascore: number | null;
};

const mobileQuery = '(max-width: 600px)';
function subscribeToViewport(callback: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
function isMobile() {
  return window.matchMedia(mobileQuery).matches;
}
function serverSnapshot() {
  return false;
}

function Poster({ movie }: { movie: Movie }) {
  const [failed, setFailed] = useState(false);
  return movie.poster && !failed ? (
    <Image
      className={styles.poster}
      src={movie.poster}
      alt=""
      width={480}
      height={720}
      unoptimized
      onError={() => setFailed(true)}
    />
  ) : (
    <span className={styles.noPoster}>Poster unavailable</span>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className={styles.card}>
      <a
        className={styles.posterLink}
        href={`https://www.imdb.com/title/${movie.id}/`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${movie.title} on IMDb (opens in a new tab)`}
      >
        <div className={styles.posterFrame}>
          <Poster movie={movie} />
          <div
            className={styles.angelRating}
            aria-label={`Angel’s rating: ${movie.rating} out of 10`}
          >
            <span>Angel’s rating</span>
            <span className={styles.angelScore}>
              {movie.rating}
              <span className={styles.angelOutOf}>/10</span>
            </span>
          </div>
        </div>
      </a>
      <h2>
        <a
          className={styles.titleLink}
          href={`https://www.imdb.com/title/${movie.id}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {movie.title}
          {movie.year !== null && (
            <>
              {' '}
              <span className={styles.year}>({movie.year})</span>
            </>
          )}
        </a>
      </h2>
      <div className={styles.scores}>
        <a
          className={styles.scoreRow}
          href={`https://www.imdb.com/title/${movie.id}/`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${movie.title}: IMDb rating ${movie.imdbRating?.toFixed(1) ?? 'unavailable'} (opens in a new tab)`}
        >
          <span className={styles.imdbIcon} aria-hidden="true">
            IMDb
          </span>
          <span className={styles.scoreValue}>
            {movie.imdbRating?.toFixed(1) ?? (
              <span className={styles.unavailable}>N/A</span>
            )}
          </span>
        </a>
        <a
          className={styles.scoreRow}
          href={metacriticMovieUrl(movie)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${movie.title}: Metascore ${movie.metascore ?? 'unavailable'} on Metacritic (opens in a new tab)`}
        >
          <span className={styles.metascoreLabel}>
            <span className={styles.metascoreIcon} aria-hidden="true">
              m
            </span>{' '}
            Metascore
          </span>
          <span
            className={
              movie.metascore === null
                ? styles.unavailable
                : `${styles.metascore} ${movie.metascore >= 70 ? styles.positive : movie.metascore >= 30 ? styles.mixed : styles.negative}`
            }
          >
            {movie.metascore ?? 'N/A'}
          </span>
        </a>
      </div>
    </div>
  );
}

const queryChangeEvent = 'movie-gallery:url-change';
function subscribeToQuery(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener(queryChangeEvent, callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(queryChangeEvent, callback);
  };
}
function querySnapshot() {
  return window.location.search;
}
function serverQuerySnapshot() {
  return '';
}

export function MovieGallery({ movies }: { movies: Movie[] }) {
  const mobile = useSyncExternalStore(
    subscribeToViewport,
    isMobile,
    serverSnapshot,
  );
  const query = useSyncExternalStore(
    subscribeToQuery,
    querySnapshot,
    serverQuerySnapshot,
  );
  const state = readGalleryState(query);
  const pageSize = mobile ? 8 : 40;
  const filtered = filterMovies(movies, state);
  const { page, totalPages, start } = moviePage(
    filtered.length,
    state.page,
    pageSize,
  );
  const visible = filtered.slice(start, start + pageSize);
  const [picked, setPicked] = useState<Movie | null>(null);
  const pickOpen = picked !== null;
  const pickDialog = useRef<HTMLDialogElement>(null);
  const results = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const dialog = pickDialog.current;
    if (!pickOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [pickOpen]);

  function updateView(patch: Partial<GalleryState>, replace = false) {
    const nextQuery = writeGalleryState(window.location.search, patch);
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
    if (
      nextUrl !==
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    ) {
      if (replace) window.history.replaceState(null, '', nextUrl);
      else window.history.pushState(null, '', nextUrl);
      window.dispatchEvent(new Event(queryChangeEvent));
    }
  }

  function changePage(nextPage: number) {
    updateView({ page: nextPage });
    results.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <>
      <div className={styles.controls}>
        <label className={styles.search}>
          <span className={styles.label}>Find a movie</span>
          <input
            type="search"
            maxLength={200}
            placeholder="Search title or year"
            value={state.search}
            onChange={(event) => {
              updateView({ search: event.target.value, page: 1 }, true);
            }}
          />
        </label>
        <label className={styles.sort}>
          <span className={styles.label}>Sort by</span>
          <select
            value={state.sort}
            onChange={(event) => {
              updateView({ sort: event.target.value as GallerySort, page: 1 });
            }}
          >
            <option value="recent">Recently rated</option>
            <option value="rating">Highest rated</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>
      <div className={styles.discovery}>
        <fieldset className={styles.filters}>
          <legend>Angel’s rating</legend>
          <div className={styles.filterButtons}>
            {(['all', '10', '9', '8', '7'] as GalleryRating[]).map((rating) => (
              <button
                key={rating}
                type="button"
                aria-label={rating === 'all' ? 'All ratings' : `${rating} out of 10`}
                aria-pressed={state.rating === rating}
                onClick={() => updateView({ rating, page: 1 })}
              >
                {rating === 'all' ? 'All' : rating}
              </button>
            ))}
          </div>
        </fieldset>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.pickButton}
            disabled={!filtered.length}
            aria-haspopup="dialog"
            onClick={() => setPicked(pickMovie(filtered, picked?.id))}
          >
            <Shuffle size={16} aria-hidden="true" /> Pick one for me
          </button>
        </div>
      </div>
      <p
        className={styles.count}
        ref={results}
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
      >
        {filtered.length.toLocaleString()}{' '}
        {filtered.length === 1 ? 'movie' : 'movies'}
        {visible.length > 0 &&
          ` · Showing ${start + 1}–${start + visible.length}`}
      </p>
      {visible.length > 0 ? (
        <ul className={styles.grid}>
          {visible.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p>
            {movies.length
              ? 'No movies match these filters.'
              : 'The movie collection is being prepared.'}
          </p>
          {(state.search || state.rating !== 'all') && (
            <button
              type="button"
              onClick={() => updateView({ search: '', rating: 'all', page: 1 })}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
      {filtered.length > 0 && (
        <nav className={styles.pagination} aria-label="Movie pages">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
          >
            ← Previous
          </button>
          <output aria-live="polite" aria-atomic="true">
            {page} / {totalPages}
          </output>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => changePage(page + 1)}
          >
            Next →
          </button>
        </nav>
      )}
      <dialog
        ref={pickDialog}
        className={styles.pickDialog}
        aria-labelledby="random-movie-title"
        onCancel={(event) => {
          event.preventDefault();
          setPicked(null);
        }}
      >
        <div className={styles.pickHeader}>
          <h2 id="random-movie-title">Your pick</h2>
          <button
            type="button"
            className={styles.closePick}
            onClick={() => setPicked(null)}
            aria-label="Close movie pick"
          >
            ×
          </button>
        </div>
        {picked && <MovieCard movie={picked} />}
        <p className={styles.pickHint}>Picked from your current filters.</p>
        <button
          type="button"
          className={styles.pickAgain}
          disabled={filtered.length < 2}
          onClick={() => setPicked(pickMovie(filtered, picked?.id))}
        >
          <Shuffle size={16} aria-hidden="true" /> Pick another
        </button>
      </dialog>
    </>
  );
}
