import type { Metadata } from "next";
import Link from "next/link";
import catalog from "@/data/movies.json";
import importStatus from "@/data/movies-status.json";
import { MovieGallery, type Movie } from "./movie-gallery";
import styles from "./movies.module.css";

const title = "Favorite Movies | Angel Gomez";
const description = "Movies I liked enough to rate 7/10 or higher.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary", title, description },
};

export default function MoviesPage() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>← Back home</Link>
      <header className={styles.header}>
        <h1>FAVORITE MOVIES</h1>
        <p>Movies I’ve rated 7 or higher. Some favorites, some just a good time.</p>
      </header>
      <MovieGallery movies={catalog as Movie[]} />
      <footer className={styles.footer}>
        My ratings, from IMDb. Select a movie to see it on IMDb.
        {importStatus.pendingTitles > 0 && (
          <p>Partial collection · {importStatus.pendingTitles.toLocaleString()} rated titles haven’t been imported yet.</p>
        )}
      </footer>
    </main>
  );
}
