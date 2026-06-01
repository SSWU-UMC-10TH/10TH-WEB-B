import type { Movie } from "../types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropBaseUrl = "https://image.tmdb.org/t/p/original";
  const fallbackImage = "https://placehold.co/600x400";

  // IMDb 검색 URL 생성 함수
  const handleIMDbSearch = () => {
    const searchUrl = `https://www.imdb.com/find?q=${encodeURIComponent(
      movie.title
    )}`;
    window.open(searchUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      {/* 모달 창 본체 */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl animate-fade-in">
        {/* 상단 포스터 배경/타이틀 영역 */}
        <div className="relative h-60 w-full bg-slate-900">
          <img
            src={
              movie.backdrop_path
                ? `${backdropBaseUrl}${movie.backdrop_path}`
                : `${imageBaseUrl}${movie.poster_path}`
            }
            alt={movie.title}
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          {/* 타이틀 및 원제 */}
          <div className="absolute bottom-6 left-6 text-white pr-12">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            {movie.original_title && (
              <p className="text-sm text-gray-300 mt-1">
                {movie.original_title}
              </p>
            )}
          </div>

          {/* 우측 상단 X 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/40 p-1.5 text-white transition-colors hover:bg-black/60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 하단 상세 정보 영역 */}
        <div className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* 왼쪽: 메인 포스터 */}
            <div className="w-full shrink-0 md:w-48">
              <img
                src={
                  movie.poster_path
                    ? `${imageBaseUrl}${movie.poster_path}`
                    : fallbackImage
                }
                alt={`${movie.title} 포스터`}
                className="w-full rounded-lg shadow-md object-cover md:h-64"
              />
            </div>

            {/* 오른쪽: 텍스트 정보 */}
            <div className="flex-1 space-y-4">
              {/* 평점 */}
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600">
                  {movie.vote_average.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  ({movie.vote_count} 평가)
                </span>
              </div>

              {/* 개봉일 및 인기도 */}
              <div className="grid grid-cols-2 gap-2 border-y border-gray-100 py-2 text-center text-sm">
                <div>
                  <p className="font-semibold text-gray-500">개봉일</p>
                  <p className="text-gray-800 mt-0.5">
                    {movie.release_date || "정보 없음"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">인기도</p>
                  <p className="text-gray-800 mt-0.5">
                    {movie.popularity.toFixed(0)}
                  </p>
                </div>
              </div>

              {/* 줄거리 */}
              <div>
                <p className="font-semibold text-gray-600 mb-1">줄거리</p>
                <p className="text-sm text-gray-600 leading-relaxed max-h-32 overflow-y-auto pr-1">
                  {movie.overview || "등록된 줄거리 정보가 없습니다."}
                </p>
              </div>
            </div>
          </div>

          {/* 최하단 버튼 레이아웃 */}
          <div className="mt-6 flex justify-center gap-3 border-t border-gray-100 pt-4">
            <button
              onClick={handleIMDbSearch}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
            >
              IMDb에서 검색
            </button>
            <button
              onClick={onClose}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
