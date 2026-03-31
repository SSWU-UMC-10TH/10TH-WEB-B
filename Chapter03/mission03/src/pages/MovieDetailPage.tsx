import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface MovieDatail {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    release_date: string;
    runtime: number | null;
    tagline: string;
    genres: { id: number; name: string }[];
}

interface Credits {
    cast: Array<{
        id: number;
        name: string;
        profile_path: string | null;
    }>;
    crew: Array<{
        id: number;
        job: string;
        name: string;
        profile_path: string | null;
    }>;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();

    const [movie, setMovie] = useState<MovieDatail | null>(null);
    const [credits, setCredits] = useState<Credits>({ cast: [], crew: [] });
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!movieId) {
            setIsError(true);
            return;
        }

        const fetchMovieData = async () => {
            setIsPending(true);
            setIsError(false);

            try {
                const movieResponse = await axios.get<MovieDatail>(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    },
                );

                const creditsResponse = await axios.get<Credits>(
                    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    },
                );

                setMovie(movieResponse.data);
                setCredits({
                    cast: creditsResponse.data.cast.slice(0, 5).map((member) => ({
                        id: member.id,
                        name: member.name,
                        profile_path: member.profile_path,
                    })),
                    crew: creditsResponse.data.crew
                        .filter((member) => member.job === "Director")
                        .map((member) => ({
                            id: member.id,
                            job: member.job,
                            name: member.name,
                            profile_path: member.profile_path,
                        })),
                });
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieData();
    }, [movieId]);

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className="p-6">
                <p className="text-red-500">영화 정보를 불러오지 못했습니다.</p>
            </div>
        );
    }

    return (
        <section className="relative min-h-screen overflow-hidden bg-black p-6 text-white">
            {movie.poster_path && (
                <div className="absolute inset-x-0 top-0 h-[44rem] overflow-hidden">
                    <div
                        className="absolute inset-0 scale-110 bg-cover bg-center blur-md"
                        style={{
                            backgroundImage: `url(${IMAGE_BASE_URL}${movie.poster_path})`,
                        }}
                    />
                    <div className="absolute inset-0 bg-black/55" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />
                </div>
            )}

            <div className="relative z-10 mx-auto max-w-5xl space-y-8">
                <div className="flex gap-8">
                    <div className="w-64 shrink-0">
                        {movie.poster_path ? (
                            <img
                                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full rounded border"
                            />
                        ) : (
                            <div className="flex h-96 items-center justify-center border bg-gray-100">
                                No poster
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold">{movie.title}</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                            <p className="rounded-full border px-3 py-1">
                                Release {movie.release_date}
                            </p>
                            <p className="rounded-full border px-3 py-1">
                                Runtime {movie.runtime ? `${movie.runtime} min` : "-"}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map((genre) => (
                                <span key={genre.id} className="rounded border px-3 py-1 text-sm">
                                    {genre.name}
                                </span>
                            ))}
                        </div>

                        <div>
                            <h2 className="mb-2 text-xl font-semibold">Overview</h2>
                            <p>{movie.overview}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:grid-cols-[minmax(0,1fr)_240px]">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Cast</h2>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {credits.cast.map((member) => (
                                <div key={member.id} className="w-24 shrink-0 text-center">
                                    {member.profile_path ? (
                                        <img
                                            src={`${IMAGE_BASE_URL}${member.profile_path}`}
                                            alt={member.name}
                                            className="mx-auto h-24 w-24 rounded-full border-2 border-white object-cover"
                                        />
                                    ) : (
                                        <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />
                                    )}
                                    <p className="mt-2 text-sm">{member.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Director</h2>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {credits.crew.map((member) => (
                                <div
                                    key={`${member.id}-${member.job}`}
                                    className="w-24 shrink-0 text-center"
                                >
                                    {member.profile_path ? (
                                        <img
                                            src={`${IMAGE_BASE_URL}${member.profile_path}`}
                                            alt={member.name}
                                            className="mx-auto h-24 w-24 rounded-full border-2 border-white object-cover"
                                        />
                                    ) : (
                                        <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />
                                    )}
                                    <p className="mt-2 text-sm">{member.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MovieDetailPage;
