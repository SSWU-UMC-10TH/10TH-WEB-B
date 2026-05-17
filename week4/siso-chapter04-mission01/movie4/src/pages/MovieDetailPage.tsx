import { useParams } from "react-router-dom";
import { useCustomFetch } from "../hooks/useCustomFetch";
import type { MovieDetail, CreditsResponse } from "../types/movie";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isLoading: movieLoading,
    isError: movieError,
  } = useCustomFetch<MovieDetail>(
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`
  );

  const {
    data: credits,
    isLoading: creditsLoading,
    isError: creditsError,
  } = useCustomFetch<CreditsResponse>(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`
  );

  const cast = credits?.cast ?? [];

  const isLoading = movieLoading || creditsLoading;
  const isError = movieError || creditsError;

  if (isLoading) return <LoadingSpinner />;
  if (isError || !movie)
    return (
      <div className="text-white text-center mt-20 text-2xl">
        데이터를 불러오는 중 문제가 발생했습니다.
        <br />
        잠시 후 다시 시도해주세요.
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 h-full p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          <div className="flex flex-col gap-2 text-gray-300 mb-4">
            <span>평균 {movie.vote_average.toFixed(1)}</span>
            <span>{movie.release_date.split("-")[0]}</span>
            <span>{movie.runtime}분</span>
          </div>

          {movie.tagline && (
            <p className="text-xl italic mb-4">"{movie.tagline}"</p>
          )}

          <p className="text-gray-300 max-w-2xl line-clamp-3">
            {movie.overview}
          </p>
        </div>
      </div>

      <div className="p-10">
        <h2 className="text-2xl font-bold mb-6">감독/출연</h2>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {cast.slice(0, 20).map((person) => (
            <div key={person.id} className="text-center w-24 flex-shrink-0">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-black border border-white mx-auto mb-2"></div>
              )}
              <p className="text-sm font-bold truncate">{person.name}</p>
              <p className="text-xs text-gray-400 truncate">
                {person.character}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
