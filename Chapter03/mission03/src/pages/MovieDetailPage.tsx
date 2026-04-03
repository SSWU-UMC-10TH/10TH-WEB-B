import { useParams } from 'react-router-dom';
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch"; // 커스텀 훅 import
import type { Movie, Person } from '../types/movie';

interface CreditsResponse {
    cast: Person[];
}

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();

    const { data: movie, isPending: isMoviePending, isError: isMovieError } = 
        useCustomFetch<Movie>(`/movie/${movieId}?language=ko-KR`);

    const { data: credits, isPending: isCreditsPending, isError: isCreditsError } = 
        useCustomFetch<CreditsResponse>(`/movie/${movieId}/credits?language=ko-KR`);

    if (isMoviePending || isCreditsPending) {
        return (
            <div className='flex items-center justify-center h-dvh bg-black'>
                <LoadingSpinner />
            </div>
        );
    }

    if (isMovieError || isCreditsError) {
        return (
            <div className='flex items-center justify-center h-dvh bg-black'>
                <span className='text-red-500 text-2xl font-bold'>데이터를 불러오는 중 에러가 발생했습니다.</span>
            </div>
        );
    }

    return (
        <div className='bg-black text-white min-h-screen'>
            {movie && (
                <section className="relative w-full h-[500px] flex items-end">
                    <div className="absolute inset-0 w-full h-full">
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                    <div className="relative z-10 p-10 w-full max-w-4xl">
                        <h1 className="text-5xl font-bold mb-4 leading-tight">{movie.title}</h1>
                        <div className="flex items-center gap-4 mb-4 text-lg font-medium text-gray-200">
                            <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
                            <span>{movie.release_date}</span>
                        </div>
                        <p className="text-lg leading-relaxed text-gray-300 line-clamp-3">{movie.overview}</p>
                    </div>
                </section>
            )}

            {credits && (
                <section className="mt-10 px-10 pb-20">
                    <h2 className="text-2xl font-bold mb-6">출연진</h2>
                    <ul className="grid grid-rows-2 grid-flow-col gap-y-8 gap-x-4 overflow-x-auto pb-6 scrollbar-hide">
                        {credits.cast.slice(0, 30).map((person) => (
                            <li key={person.id} className="flex-shrink-0 w-32 text-center">
                                <div className="w-24 h-24 mx-auto mb-3 overflow-hidden rounded-full border-2 border-gray-700 shadow-lg bg-gray-800">
                                    {person.profile_path ? (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                            alt={person.name} 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 italic">No Image</div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white truncate">{person.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{person.character}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}