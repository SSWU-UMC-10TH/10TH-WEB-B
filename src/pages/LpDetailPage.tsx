import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../apis/lp';

const LpDetailPage = () => {
  const { lpid } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid!),
    enabled: !!lpid,
    staleTime: 1000 * 60 * 3,
  });

  console.log(data); 

 if (isLoading) return <div>로딩중...</div>;

 if (isError)
  return (
    <div>
      에러 발생
      <button onClick={() => window.location.reload()}>
        다시 시도
      </button>
    </div>
  );

  const lp = data?.data; 

  return (
    <div style={{ padding: '20px' }}>
      <h1>{lp?.title}</h1>
      <p>{lp?.content ?? '내용 없음'}</p>
      <p>좋아요: {lp?.likes ?? 0}</p>
    </div>
  );
};

export default LpDetailPage;