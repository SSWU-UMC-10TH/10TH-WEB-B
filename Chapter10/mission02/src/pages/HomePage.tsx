import { useMemo, useState } from "react";
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
    const requestOptions = useMemo(() => ({ params: filters }), [filters]);
    const { data, error, isLoading } = useFetch<MovieResponse>(
        "/search/movie",
        requestOptions,
    );

    return (
        <main className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="mx-auto max-w-6xl">
                <MovieFilter onChange={setFilters} />
                {isLoading ? (
                    <div className="py-20 text-center font-semibold text-gray-500">
                        로딩 중입니다...
                    </div>
                ) : error ? (
                    <div className="py-20 text-center font-semibold text-red-600">{error}</div>
                ) : (
                    <MovieList movies={data?.results || []} onSelectMovie={setSelectedMovie} />
                )}
            </div>
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </main>
    );
}
