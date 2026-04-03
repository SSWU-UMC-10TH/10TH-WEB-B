import { useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch"; // 훅 불러오기
import type { MovieResponse } from "../types/movie";

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();

    const { data, isPending, isError } = useCustomFetch<MovieResponse>(
        `/movie/${category}?language=ko-KR&page=${page}`
    );

    const movies = data?.results || [];

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className='text-red-500 text-2xl font-bold'>
                    데이터를 불러오는 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요!
                </span>
            </div>
        );
    }

    return (
        <>
            <div className='flex items-center justify-center gap-6 mt-5'>
                <button 
                    className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md disabled:bg-gray-300'
                    disabled={page === 1} 
                    onClick={() => setPage((prev) => prev - 1)}
                >
                    {`<`}
                </button>
                <span className="font-bold">{page} 페이지</span>
                <button 
                    className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md'
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    {`>`}
                </button>
            </div>

            {isPending ? (
                <div className='flex items-center justify-center h-96'>
                    <LoadingSpinner />
                </div>
            ) : (
                <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </>
    );
}