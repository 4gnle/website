// Verified exceptions where Metacritic adds a year to distinguish remakes.
const metacriticSlugs: Record<string, string> = {
  tt1219827: "ghost-in-the-shell-2017",
  tt9421570: "the-guilty-2021",
  tt1568346: "the-girl-with-the-dragon-tattoo-2011",
  tt3040964: "the-jungle-book-2016",
  tt0831387: "godzilla-2014",
};

export function metacriticMovieUrl(movie: { id: string; title: string }) {
  const slug = metacriticSlugs[movie.id] ?? movie.title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `https://www.metacritic.com/movie/${slug}/`;
}
