import { useEffect } from "react";
import type { Movie } from "../types/movie";

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

const imageBaseUrl = "https://image.tmdb.org/t/p/w780";
const fallbackImage = "https://via.placeholder.com/780x440?text=No+Image";

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const posterUrl = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage;
    const imdbSearchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
            role="presentation"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="movie-modal-title"
                onClick={(event) => event.stopPropagation()}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
                <img
                    src={posterUrl}
                    alt={`${movie.title} 포스터`}
                    className="h-80 w-full object-cover object-top"
                />
                <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="movie-modal-title" className="text-2xl font-bold text-gray-900">
                                {movie.title}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">{movie.original_title}</p>
                        </div>
                        <span className="rounded-lg bg-amber-400 px-3 py-1 font-bold text-gray-900">
                            평점 {movie.vote_average.toFixed(1)}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                        개봉일: {movie.release_date || "정보 없음"}
                    </p>
                    <p className="leading-7 text-gray-700">
                        {movie.overview || "등록된 줄거리가 없습니다."}
                    </p>
                    <div className="flex flex-wrap justify-end gap-3 pt-2">
                        <a
                            href={imdbSearchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-amber-500"
                        >
                            IMDb에서 검색하기
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-800"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
