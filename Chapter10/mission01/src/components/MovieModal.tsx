import { memo } from "react";
import type { Movie } from "../types/movie";

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
    const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
    const fallbackImage = "https://via.placeholder.com/640x960?text=No+Image";
    const posterUrl = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : fallbackImage;
    const imdbSearchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(movie.title)}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
            onClick={onClose}
        >
            <div
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/70 px-3 py-1 text-sm font-bold text-white transition hover:bg-black"
                    aria-label="모달 닫기"
                >
                    X
                </button>

                <div className="h-56 w-full bg-gray-200 md:h-72">
                    <img
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="border-t border-gray-200 bg-white p-6 md:p-8">
                    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                    <div>
                        <img
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                            className="aspect-[2/3] w-44 rounded-xl object-cover shadow-xl md:w-full"
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="pr-12 text-3xl font-bold text-gray-900">
                                {movie.title}
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">{movie.original_title}</p>
                        </div>

                        <dl className="space-y-2 text-sm text-gray-700">
                            <div className="flex gap-2">
                                <dt className="font-semibold text-gray-900">평점:</dt>
                                <dd>{movie.vote_average.toFixed(1)}</dd>
                            </div>
                            <div className="flex gap-2">
                                <dt className="font-semibold text-gray-900">개봉일:</dt>
                                <dd>{movie.release_date || "정보 없음"}</dd>
                            </div>
                            <div className="flex gap-2">
                                <dt className="font-semibold text-gray-900">인기도:</dt>
                                <dd>{movie.popularity.toFixed(1)}</dd>
                            </div>
                        </dl>

                        <div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">줄거리</h3>
                            <p className="leading-7 text-gray-700">
                                {movie.overview || "등록된 줄거리가 없습니다."}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                            <a
                                href={imdbSearchUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-blue-600 px-5 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
                            >
                                IMDb에서 검색하기
                            </a>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(MovieModal);
