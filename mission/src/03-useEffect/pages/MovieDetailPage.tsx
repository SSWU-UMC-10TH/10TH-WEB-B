import { useParams } from "react-router-dom";
import { type MovieDetail, type Credits } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCustomFetch } from "../hooks/useCustomFetch";

const BASE_IMG = "https://image.tmdb.org/t/p";

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();

    const { data: movie, isPending: moviePending, isError: movieError } =
        useCustomFetch<MovieDetail>(
            movieId ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR` : ''
        );

    const { data: credits, isPending: creditsPending, isError: creditsError } =
        useCustomFetch<Credits>(
            movieId ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR` : ''
        );

    const isPending = moviePending || creditsPending;
    const isError = movieError || creditsError;

    if (isPending) return (
        <div className="flex justify-center items-center h-dvh">
            <LoadingSpinner />
        </div>
    );

    if (isError) return (
        <div className="flex justify-center items-center h-dvh">
            <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
        </div>
    );

    if (!movie) return null;

    const director = credits?.crew.find(c => c.department === "Directing");

    // 나머지 return JSX는 그대로
    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="relative h-96 overflow-hidden">
                <img
                    src={`${BASE_IMG}/w1280${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900" />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-32 relative">
                <div className="flex gap-8">
                    <img
                        src={`${BASE_IMG}/w342${movie.poster_path}`}
                        alt={movie.title}
                        className="w-48 rounded-xl shadow-2xl flex-shrink-0"
                    />
                    <div className="flex flex-col justify-end pb-4">
                        <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                        <div className="flex gap-4 text-gray-400 text-sm mb-3">
                            <span>{movie.vote_average.toFixed(1)}</span>
                            <span>{movie.release_date.slice(0, 4)}</span>
                            <span>{movie.runtime}분</span>
                        </div>
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {movie.genres.map(g => (
                                <span key={g.id}
                                    className="px-3 py-1 bg-[#dda5e3] text-white rounded-full text-xs">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                        {movie.tagline && (
                            <p className="text-[#b2dab1] italic mb-2">{movie.tagline}</p>
                        )}
                        <p className="text-gray-300 leading-relaxed text-sm">{movie.overview}</p>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">감독/출연</h2>
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {director && (
                            <div className="flex flex-col items-center flex-shrink-0 w-24">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 mb-2">
                                    {director.profile_path
                                        ? <img src={`${BASE_IMG}/w185${director.profile_path}`}
                                            alt={director.name}
                                            className="w-full h-full object-cover" />
                                        : <div className="w-full h-full" />}
                                </div>
                                <span className="text-sm text-center font-semibold">{director.name}</span>
                                <span className="text-xs text-[#dda5e3] text-center">감독</span>
                            </div>
                        )}
                        {credits?.cast.slice(0, 20).map(member => (
                            <div key={member.id} className="flex flex-col items-center flex-shrink-0 w-24">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 mb-2">
                                    {member.profile_path
                                        ? <img src={`${BASE_IMG}/w185${member.profile_path}`}
                                            alt={member.name}
                                            className="w-full h-full object-cover" />
                                        : <div className="w-full h-full" />}
                                </div>
                                <span className="text-sm text-center font-semibold">{member.name}</span>
                                <span className="text-xs text-gray-400 text-center">{member.character}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;