import { useState } from 'react';
import type { Movie } from '../types/movie'
import { useNavigate } from 'react-router-dom'

interface MovieCardProps {
    movie: Movie;
}

export default function Moviecard({ movie }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/movie/${movie.id}`)}
            className='relative rounded-xl shadow-lg overflow-hidden cursor-pointer
            w-44 transition-transform duration-600 hover:scale-105'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={`${movie.title}`}
                className=''
            />

            {isHovered && (
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 
                to-transparent backdrop-blur-md flex flex-col justify-center
                items-center text-white'>
                    <h2 className='text-lg font-bold text-center leading-sung'>{movie.title}</h2>
                    <p className='text-sm text-gray-300 leading-relaxed text-center
                    mt-2 line-clamp-5'>{movie.overview}</p>
                </div>
            )}
        </div>)
}