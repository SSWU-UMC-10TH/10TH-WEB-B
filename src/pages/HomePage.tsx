import { useQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lp';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const [sort, setSort] = useState('latest');
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['lps', sort],
    queryFn: () => getLps(sort),
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  });

  const lps = data?.data?.data ?? [];

  if (isLoading) return <div>로딩중...</div>;

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
        {lps.map((lp: any) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)}
            style={{
              width: '220px',
              border: '1px solid #ddd',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* 이미지 영역 */}
            <div
              style={{
                height: '140px',
                background: '#eee',
              }}
            />

            {/* 정보 */}
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '6px' }}>
                {lp.title}
              </h3>

              <p style={{ fontSize: '12px', color: '#666' }}>
                👍 {lp.likes ?? 0}
              </p>

              <p style={{ fontSize: '11px', color: '#aaa' }}>
                {lp.createdAt ?? ''}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HomePage;
