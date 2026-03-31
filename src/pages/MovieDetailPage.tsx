import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import type { MovieDetail } from "../types/movie";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<any>(null);

  const [isPending, setIsPending] = useState(false); 
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      setIsPending(true);

      try {
        const [movieRes, creditRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/credits`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);

        setMovie(movieRes.data);      
        setCredits(creditRes.data);   

      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (isError) return <div>에러 발생</div>;
  if (isPending) return <div>로딩중...</div>;

  return (
    <div className="p-10 text-black">
      <h1 className="text-3xl font-bold">{movie?.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`}
        alt={movie?.title}
      />

      <p className="mt-4">{movie?.overview}</p>

      <p className="mt-2">⭐ 평점: {movie?.vote_average}</p>

      <p className="mt-2">📅 개봉일: {movie?.release_date}</p>

      <p className="mt-2">⏱ 러닝타임: {movie?.runtime}분</p>

      
      <h2 className="mt-10 text-2xl font-bold">출연진</h2>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {credits?.cast?.slice(0, 6).map((actor: any) => (
          <div key={actor.id} className="text-center">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/200x300"
              }
              alt={actor.name}
              className="rounded-lg"
            />
            <p className="mt-2 font-semibold">{actor.name}</p>
            <p className="text-sm text-gray-400">{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailPage;

