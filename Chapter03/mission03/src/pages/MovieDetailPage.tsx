import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { Movie, Person } from '../types/movie';
import { LoadingSpinner } from "../components/LoadingSpinner";

interface CreditsResponse {
    cast: Person[];
}

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [credits, setCredits] = useState<CreditsResponse | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieData = async () => {
            setIsPending(true);
            setIsError(false);

            try {
                const options = {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                };

                const [movieRes, creditsRes] = await Promise.all([
                    axios.get<Movie>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, options),
                    axios.get<CreditsResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, options)
                ]);

                setMovie(movieRes.data);
                setCredits(creditsRes.data);
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        if (movieId) fetchMovieData();
    }, [movieId]);

    if (isPending)
        return (<div className='flex items-center justify-center h-dvh'>
            <LoadingSpinner />
        </div>);
    if (isError) return (
            <div>
                <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
            </div>
        );

    return (
        <div className='bg-black text-white'>
            {movie && (
                <section className="relative w-full h-[500px] flex items-end">
                    <div className="absolute inset-0 w-full h-full">
                        <img
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>
                    <div className="relative z-10 p-10 w-full max-w-4xl">
                        <h1 className="text-5xl font-bold mb-4 leading-tight text-white">
                            {movie.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-4 text-lg font-medium text-gray-200">
                            <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
                            <span>{movie.release_date}</span>
                        </div>

                        <p className="text-lg leading-relaxed text-gray-300 line-clamp-3">
                            {movie.overview}
                        </p>
                    </div>
                </section>
            )}

            {credits && (
                <section className="mt-10 px-4">
                    <h2 className="text-2xl font-bold mb-6 text-white">출연진</h2>
                    <ul className="flex grid grid-rows-2 grid-flow-col gap-y-8 gap-2 overflow-x-auto pb-6 scrollbar-hide">
                        {credits.cast.slice(0, 30).map((person) => (
                            <li key={person.id} className="flex-shrink-0 w-32 text-center">
                                <div className="w-24 h-24 mx-auto mb-3 overflow-hidden rounded-full border-2 border-gray-700 shadow-lg">
                                    {person.profile_path ? (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                            alt={person.name} />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-white truncate">
                                        {person.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {person.character}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}