import useFetch from "../hooks/useFetch"
import type { MovieFilters, MovieResponse, Movie } from "../types/movie";
import MovieList from "../components/MovieList";
import MovieFilter from "../components/MovieFilter";
import MovieModal from "../components/MovieModal";
import { useCallback, useMemo, useState } from "react";

export default function HomePage() {
    const [filters, setFilters] = useState<MovieFilters>({
        query: '어벤져스',
        include_adult: false,
        language: 'ko-KR'
    });

    const axiosRequestConfig = useMemo((): {params: MovieFilters} => ({
        params: filters
    }), [filters]);
    
    const {data, error, isLoading} = useFetch<MovieResponse>(
        '/search/movie',
        axiosRequestConfig
    );

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSelectMovie = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
    }, []);

    const handleCloseModal = useCallback(() => setSelectedMovie(null), []);

    const handleMovieFilters = useCallback((filters: MovieFilters) => {
        setFilters(filters);
    }, [setFilters]);

    if(error) {
        return <div>에러가 발생했습니다.</div>
    }

  return (
    <div className="container">
        <MovieFilter onChange={handleMovieFilters} />
        {isLoading ? (
            <div> 로딩중 입니다.</div>
        ) : (
            <MovieList movies={data?.results || []} onSelect={handleSelectMovie} />
        )}
        {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
        
    </div>
  );
};