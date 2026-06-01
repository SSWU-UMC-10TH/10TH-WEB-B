import type { Movie } from "../types/movie";

interface MovieCardProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    const fallbackImage = "https://via.placeholder.com/640x480?text=No+Image";

    return (
        <button
            type="button"
            onClick={() => onClick(movie)}
            className="cursor-pointer overflow-hidden rounded-lg bg-white text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative h-80 overflow-hidden">
                <img
                    src={movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage}
                    alt={`${movie.title} 포스터`}
                    className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
                <div className="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-sm font-bold text-white">
                    {movie.vote_average.toFixed(1)}
                </div>
            </div>
            <div className="p-4">
                <h3 className="mb-2 text-lg font-bold text-gray-800">{movie.title}</h3>
                <p className="text-sm text-gray-600">
                    {movie.release_date || "개봉일 정보 없음"} | {movie.original_language.toUpperCase()}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                    {movie.overview.length > 100
                        ? `${movie.overview.slice(0, 100)}...`
                        : movie.overview || "등록된 줄거리가 없습니다."}
                </p>
            </div>
        </button>
    );
}
