"use client";

import Image from "next/image";
import { metacriticMovieUrl } from "@/lib/movie-links";
import { useState, useSyncExternalStore } from "react";
import styles from "./movies.module.css";

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

const mobileQuery = "(max-width: 600px)";
function subscribeToViewport(callback: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
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

export function MovieGallery({ movies }: { movies: Movie[] }) {
  const mobile = useSyncExternalStore(subscribeToViewport, isMobile, serverSnapshot);
  const pageSize = mobile ? 8 : 40;
  const [firstIndex, setFirstIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");
  const query = search.trim().toLocaleLowerCase();
  const filtered = movies.filter((movie) =>
    `${movie.title} ${movie.year ?? ""}`.toLocaleLowerCase().includes(query),
  ).sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "recent") return b.ratedAt.localeCompare(a.ratedAt) || a.title.localeCompare(b.title);
    return b.rating - a.rating || a.title.localeCompare(b.title);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(Math.floor(firstIndex / pageSize), totalPages - 1);
  const start = page * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  return (
    <>
      <div className={styles.controls}>
        <label className={styles.search}>
          <span className={styles.label}>Find a movie</span>
          <input type="search" placeholder="Search title or year" value={search} onChange={(event) => {
            setSearch(event.target.value);
            setFirstIndex(0);
          }} />
        </label>
        <label className={styles.sort}>
          <span className={styles.label}>Sort by</span>
          <select value={sort} onChange={(event) => {
            setSort(event.target.value);
            setFirstIndex(0);
          }}>
            <option value="rating">Highest rated</option>
            <option value="recent">Recently rated</option>
            <option value="title">Title A–Z</option>
          </select>
        </label>
      </div>
      <p className={styles.count} role="note">
        {filtered.length.toLocaleString()} {filtered.length === 1 ? "movie" : "movies"}
        {visible.length > 0 && ` · Showing ${start + 1}–${start + visible.length}`}
      </p>
      {visible.length > 0 ? (
        <ul className={styles.grid}>
          {visible.map((movie) => (
            <li key={movie.id}>
              <div className={styles.card}>
                <a className={styles.posterLink} href={`https://www.imdb.com/title/${movie.id}/`} target="_blank" rel="noopener noreferrer" aria-label={`${movie.title} on IMDb (opens in a new tab)`}>
                  <div className={styles.posterFrame}>
                    <Poster movie={movie} />
                    <div className={styles.angelRating} aria-label={`Angel’s rating: ${movie.rating} out of 10`}>
                      <span>Angel’s rating</span>
                      <span className={styles.angelScore}>{movie.rating}<span className={styles.angelOutOf}>/10</span></span>
                    </div>
                  </div>
                </a>
                <h2><a className={styles.titleLink} href={`https://www.imdb.com/title/${movie.id}/`} target="_blank" rel="noopener noreferrer">{movie.title}{movie.year !== null && <> <span className={styles.year}>({movie.year})</span></>}</a></h2>
                <div className={styles.scores}>
                  <a className={styles.scoreRow} href={`https://www.imdb.com/title/${movie.id}/`} target="_blank" rel="noopener noreferrer" aria-label={`${movie.title}: IMDb rating ${movie.imdbRating?.toFixed(1) ?? "unavailable"} (opens in a new tab)`}>
                    <span className={styles.imdbIcon} aria-hidden="true">IMDb</span>
                    <span className={styles.scoreValue}>{movie.imdbRating?.toFixed(1) ?? <span className={styles.unavailable}>N/A</span>}</span>
                  </a>
                  <a className={styles.scoreRow} href={metacriticMovieUrl(movie)} target="_blank" rel="noopener noreferrer" aria-label={`${movie.title}: Metascore ${movie.metascore ?? "unavailable"} on Metacritic (opens in a new tab)`}>
                    <span className={styles.metascoreLabel}><span className={styles.metascoreIcon} aria-hidden="true">m</span> Metascore</span>
                    <span className={movie.metascore === null ? styles.unavailable : `${styles.metascore} ${movie.metascore >= 70 ? styles.positive : movie.metascore >= 30 ? styles.mixed : styles.negative}`}>
                      {movie.metascore ?? "N/A"}
                    </span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{movies.length ? "No movies match that search." : "The movie collection is being prepared."}</p>
      )}
      {filtered.length > 0 && (
        <nav className={styles.pagination} aria-label="Movie pages">
          <button type="button" disabled={page === 0} onClick={() => setFirstIndex((page - 1) * pageSize)}>← Previous</button>
          <output aria-live="polite" aria-atomic="true">{page + 1} / {totalPages}</output>
          <button type="button" disabled={page === totalPages - 1} onClick={() => setFirstIndex((page + 1) * pageSize)}>Next →</button>
        </nav>
      )}
    </>
  );
}
