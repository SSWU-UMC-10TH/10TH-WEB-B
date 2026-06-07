import { memo } from "react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
}

const MovieCard = ({ movie, onSelect }: MovieCardProps) => {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    const fallbackImage = "https://via.placeholder.com/500x750?text=No+Image";
  return (
    <div onClick={() => onSelect && onSelect(movie)} className="cursor-pointer overflow-hidden rounded-lg shadow-md bg-white transition-all hover:shadow-lg">
        <div className="relative overflow-hidden h-80">
            <img src={
                movie.poster_path 
                ? `${imageBaseUrl}${movie.poster_path}` 
                : fallbackImage
                } 
                alt={`${movie.title} 포스터`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 ease-in-out"
            />
            <div className="absolute right-2 top-2 rounded-md bg-black px-2 py-1 text-sm font-bold text-white" >
                {movie.vote_average.toFixed(1)}
            </div>
        </div>

        <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-600">{movie.release_date} | {movie.original_language.toUpperCase()}</p>
            <p className="text-gray-700 text-sm mt-2">{movie.overview.length > 100 ? `${movie.overview.slice(0, 100)}...` : movie.overview}</p>
        </div>
    </div>
  )
};
export default memo(MovieCard);