//import { useQuery } from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lp';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const [sort, setSort] = useState('latest');
  const navigate = useNavigate();

  // const { data, isLoading, isError, refetch } = useQuery({
  //   queryKey: ['lps', sort],
  //   queryFn: () => getLps(sort),
  //   staleTime: 1000 * 60 * 3,
  //   gcTime: 1000 * 60 * 10,
  // });
  const SkeletonList = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '220px',
            height: '200px',
            background: '#e0e0e0',
            borderRadius: '12px',
            animation: 'pulse 1.5s infinite',
          }}
        />
      ))}
    </div>
  );
};
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
  refetch,
} = useInfiniteQuery({
  queryKey: ['lps', sort],
  queryFn: ({ pageParam = 0 }: any) => getLps(sort, pageParam),
  initialPageParam: 0,

  getNextPageParam: (lastPage: any) => {
    return lastPage.data.hasNext
      ? lastPage.data.nextCursor
      : undefined;
  },
});
  


  //const lps = data?.data?.data ?? [];
  const lps = data?.pages.flatMap(page => page.data.data) ?? [];
  //console.log(data?.pages[0]);
  const loadMoreRef = useRef(null);

  useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  });

  if (loadMoreRef.current) {
    observer.observe(loadMoreRef.current);
  }

  return () => observer.disconnect();
}, [hasNextPage, fetchNextPage]);
  const sortedLps = [...lps].sort((a, b) => {
  if (sort === "latest") {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  //if (isLoading) return <div>로딩중...</div>;
  if (isLoading) return <SkeletonList />;

  if (isError)
    return (
      <div>
        에러 발생
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );

  return (
  <div style={{ padding: '20px' }}>
    
    {/* 정렬 버튼 */}
    <div style={{ marginBottom: '20px' }}>
      <button
        onClick={() => setSort('latest')}
        style={{
          marginRight: '10px',
          fontWeight: sort === 'latest' ? 'bold' : 'normal',
        }}
      >
        최신순
      </button>

      <button
        onClick={() => setSort('oldest')}
        style={{
          fontWeight: sort === 'oldest' ? 'bold' : 'normal',
        }}
      >
        오래된순
      </button>
    </div>

    {/* 카드 리스트 */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {sortedLps.map((lp: any, index) => (
        <div
          key={lp.id ?? index }
          onClick={() => navigate(`/lp/${lp.id}`)}
          className="card"
          style={{
            position: 'relative',
            width: '220px',
            borderRadius: '12px',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          
        >
          {/* 이미지 */}
          <img
            src={lp.thumbnail}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
            }}
          />

          {/* 오버레이 */}
          <div
            className="overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '10px',
              
              transition: '0.3s',
            }}
          >
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>
              {lp.title}
            </div>
            <div style={{ fontSize: '12px' }}>
              👍 {Array.isArray(lp.likes) ? lp.likes.length : lp.likes ?? 0}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              {lp.createdAt}
            </div>
          </div>
        </div>
      ))}
    </div>
    {isFetchingNextPage && <SkeletonList />}
    <div ref={loadMoreRef} style={{ height: '50px' }} />

  </div>
);
};

export default HomePage;
