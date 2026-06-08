import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal";
import useFetch from "../hooks/useFetch";
import type { Movie, MovieFilters, MovieResponse } from "../types/movie";

export default function HomePage() {
    const [filters, setFilters] = useState<MovieFilters>({
        query: "어벤져스",
        include_adult: false,
        language: "ko-KR",
    });
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const axiosRequestConfig = useMemo(
        () => ({
            params: {
                query: filters.query,
                include_adult: filters.include_adult,
                language: filters.language,
            },
        }),
        [filters.include_adult, filters.language, filters.query],
    );

    const { data, error, isLoading } = useFetch<MovieResponse>("/search/movie", axiosRequestConfig);

    const movies = useMemo(() => {
        const results = data?.results || [];

        if (filters.include_adult) {
            return results;
        }

        return results.filter((movie) => !movie.adult);
    }, [data?.results, filters.include_adult]);

    const handleMovieFilters = useCallback(
        (filters: MovieFilters) => {
            setFilters(filters);
            setSelectedMovie(null);
        },
        [],
    );

    const handleSelectMovie = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedMovie(null);
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <MovieFilter initialFilters={filters} onChange={handleMovieFilters} />
                {isLoading ? (
                    <div className="py-20 text-center font-semibold text-gray-500">
                        로딩 중입니다...
                    </div>
                ) : (
                    <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
                )}
            </div>

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </main>
    );
}
