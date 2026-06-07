import React, { useEffect } from 'react';
import type { Movie } from '../types/movie';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
const posterBaseUrl = 'https://image.tmdb.org/t/p/w300';

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const openImdb = () => {
    const query = encodeURIComponent(movie.title || movie.original_title || '');
    window.open(`https://www.imdb.com/find?q=${query}`, '_blank');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative max-w-4xl w-full rounded-lg bg-white shadow-xl">
        <div className="h-56 w-full overflow-hidden rounded-t-lg bg-gray-800">
          {movie.backdrop_path && (
            <img src={`${imageBaseUrl}${movie.backdrop_path}`} alt="backdrop" className="w-full h-full object-cover opacity-90" />
          )}
        </div>

        <div className="p-6 flex gap-6">
          <img src={movie.poster_path ? `${posterBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'} alt="poster" className="w-40 rounded shadow" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <p className="text-sm text-gray-600">{movie.original_title}</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-700"><strong>평점:</strong> {movie.vote_average.toFixed(1)} ({movie.vote_count})</p>
              <p className="text-sm text-gray-700"><strong>개봉일:</strong> {movie.release_date}</p>
              <div className="h-1 bg-gray-200 my-3 rounded-full"><div className="h-1 bg-blue-400 rounded-full" style={{width: `${(movie.vote_average/10)*100}%`}} /></div>
              <p className="text-gray-700 text-sm leading-relaxed">{movie.overview}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={openImdb} className="rounded bg-blue-600 px-4 py-2 text-white">IMDb에서 검색하기</button>
              <button onClick={onClose} className="rounded border px-4 py-2">닫기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal;
