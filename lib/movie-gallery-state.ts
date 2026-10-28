export type GallerySort = 'recent' | 'rating' | 'title';
export type GalleryRating = 'all' | '10' | '9' | '8' | '7';
export type GalleryState = {
  search: string;
  sort: GallerySort;
  rating: GalleryRating;
  page: number;
};

type SortableMovie = {
  title: string;
  year: number | null;
  rating: number;
  ratedAt: string;
};

export function readGalleryState(query: string): GalleryState {
  const params = new URLSearchParams(query);
  const sort = params.get('sort');
  const rating = params.get('rating');
  const rawPage = params.get('page') ?? '1';
  const page = /^\d+$/.test(rawPage) ? Number(rawPage) : 1;
  return {
    search: (params.get('q') ?? '').slice(0, 200),
    sort: sort === 'rating' || sort === 'title' ? sort : 'recent',
    rating:
      rating === '10' || rating === '9' || rating === '8' || rating === '7'
        ? rating
        : 'all',
    page: Number.isSafeInteger(page) && page >= 1 ? page : 1,
  };
}

export function writeGalleryState(query: string, patch: Partial<GalleryState>) {
  const state = { ...readGalleryState(query), ...patch };
  const params = new URLSearchParams(query);
  const values = {
    q: state.search,
    sort: state.sort === 'recent' ? '' : state.sort,
    rating: state.rating === 'all' ? '' : state.rating,
    page: state.page > 1 ? String(state.page) : '',
  };
  for (const [name, value] of Object.entries(values)) {
    if (value) params.set(name, value);
    else params.delete(name);
  }
  return params.toString();
}

export function filterMovies<T extends SortableMovie>(
  movies: T[],
  state: GalleryState,
): T[] {
  const query = state.search.trim().toLocaleLowerCase();
  return movies
    .filter(
      (movie) =>
        (state.rating === 'all' || movie.rating === Number(state.rating)) &&
        `${movie.title} ${movie.year ?? ''}`
          .toLocaleLowerCase()
          .includes(query),
    )
    .sort((a, b) => {
      if (state.sort === 'title') return a.title.localeCompare(b.title);
      const recency = Date.parse(b.ratedAt) - Date.parse(a.ratedAt);
      if (state.sort === 'recent')
        return recency || a.title.localeCompare(b.title);
      return b.rating - a.rating || recency || a.title.localeCompare(b.title);
    });
}

export function moviePage(
  total: number,
  requestedPage: number,
  pageSize: number,
) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  return { page, totalPages, start: (page - 1) * pageSize };
}

export function pickMovie<T extends { id: string }>(
  movies: T[],
  previousId?: string,
  random = Math.random(),
): T | null {
  const pool =
    movies.length > 1
      ? movies.filter((movie) => movie.id !== previousId)
      : movies;
  if (!pool.length) return null;
  return pool[
    Math.min(pool.length - 1, Math.max(0, Math.floor(random * pool.length)))
  ];
}
