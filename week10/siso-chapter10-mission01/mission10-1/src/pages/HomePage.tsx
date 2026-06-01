import { useCallback, useMemo, useState } from "react";
import MovieFilter from "../components/MovieFilter";
import MovieList from "../components/MovieList";
import useFetch from "../hooks/useFetch";
import type { Movie, MovieFilters, MovieResponse } from "../types/movie";
import MovieModal from "../components/MovieModal";

export default function HomePage() {
  const [filters, setFilters] = useState<MovieFilters>({
    query: "어벤져스",
    include_adult: false,
    language: "ko-KR",
  });

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const axiosRequestConfig = useMemo(
    () => ({
      params: filters,
    }),
    [filters]
  );

  const { data, error, isLoading } = useFetch<MovieResponse>(
    "search/movie",
    axiosRequestConfig
  );

  const handleMovieFilters = useCallback(
    (filters: MovieFilters) => {
      setFilters(filters);
    },
    [setFilters]
  );

  if (error) {
    return <div>{error}</div>;
  }
  /*
  return (
    <div className="container">
      <MovieFilter onChange={handleMovieFilters} />
      {isLoading ? (
        <div>로딩 중 입니다...</div>
      ) : (
        <MovieList
          movies={data?.results || []}
          onMovieClick={setSelectedMovie}
        />
      )}
    </div>
  );
  */
  return (
    <div className="container mx-auto p-4">
      <MovieFilter onChange={handleMovieFilters} />

      <div className="mt-8">
        {isLoading ? (
          <div className="text-center font-semibold py-10">
            로딩 중 입니다...
          </div>
        ) : (
          <MovieList
            movies={data?.results || []}
            onMovieClick={setSelectedMovie} // 카드 클릭 시 상태 변경 함수 전달
          />
        )}
      </div>

      {/* 선택된 영화가 존재할 때만 모달 레이어 렌더링 */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)} // 닫기 누르면 상태를 다시 null로
        />
      )}
    </div>
  );
}

//검색 필터링
//영화 무비
