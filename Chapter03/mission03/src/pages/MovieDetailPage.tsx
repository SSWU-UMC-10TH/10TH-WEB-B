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
    }>;
    crew: Array<{
        id: number;
        job: string;
        name: string;
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
                    })),
                    crew: creditsResponse.data.crew
                        .filter((member) => member.job === "Director")
                        .map((member) => ({
                            id: member.id,
                            job: member.job,
                            name: member.name,
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
        <section className="min-h-screen bg-white p-6 text-black">
            <div className="mx-auto max-w-5xl space-y-8">
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
                            <p className="text-gray-600">{movie.original_title}</p>
                        </div>

                        <p>{movie.release_date}</p>
                        <p>{movie.runtime ? `${movie.runtime} min` : "-"}</p>

                        {movie.tagline && <p className="text-gray-600">{movie.tagline}</p>}

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

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Cast</h2>
                    <div className="grid gap-3">
                        {credits.cast.map((member) => (
                            <div key={member.id} className="rounded border p-3">
                                {member.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Director</h2>
                    <div className="grid gap-3">
                        {credits.crew.map((member) => (
                            <div key={`${member.id}-${member.job}`} className="rounded border p-3">
                                {member.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MovieDetailPage;
