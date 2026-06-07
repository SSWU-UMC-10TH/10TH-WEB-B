import { memo } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  onSelect?: (movie: Movie) => void;
}

const MovieList = ({ movies, onSelect }: MovieListProps) => {
    if (movies.length === 0) {
        return (
            <div className="flex h-60 itmems-center justify-center">
                <p className="font-bold text-gray-500">영화가 없습니다.</p>
            </div>
        )
    }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />
        ))}
    </div>
  )
};      
export default memo(MovieList);