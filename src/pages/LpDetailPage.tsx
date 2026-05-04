import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLpDetail, postLikeLp } from '../apis/lp';
import { useState, useEffect } from 'react';

const LpDetailPage = () => {
  const { lpid } = useParams();

  // useQuery 먼저
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => getLpDetail(lpid!),
    enabled: !!lpid,
    staleTime: 1000 * 60 * 3,
  });

  // 그 다음 데이터
  const lp = data?.data;

  // hook은 항상 위에
  const [likes, setLikes] = useState(0);

  useEffect(() => {
  if (lp) {
    setLikes(Array.isArray(lp.likes) ? lp.likes.length : lp.likes ?? 0);
  }
}, [lp]);

  // 그 다음 조건문
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

  return (
    <div style={{ padding: '20px' }}>
      
      {/* 제목 + 버튼 */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}>
        <h1>{lp?.title}</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button>✏️ 수정</button>
          <button>🗑 삭제</button>
        </div>
      </div>

      {/* 이미지 */}
      {/* <div style={{ marginBottom: "20px" }}>
        <img src={lp?.thumbnail} style={{ width: "300px" }} />
      </div> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
            src={lp?.thumbnail}
            style={{
                width: "300px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "10px"
            }}
        />
      </div>

      {/* 내용 */}
      <div style={{ marginBottom: "20px" }}>
        <p>{lp?.content}</p>
      </div>

      {/* 좋아요 */}
    <div style={{
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        }}>
        <button
            onClick={async () => {
            if (!lp) return;

      try {
        const res = await postLikeLp(Number(lp.id));
        console.log(res);

        // 서버가 likes 반환하면 그걸로 세팅
        if (res?.data?.likes !== undefined) {
          setLikes(res.data.likes);
        } else {
          // fallback
          setLikes((prev) => prev + 1);
        }

      } catch (e) {
        console.error(e);
      }
    }}
    >
    ❤️ 좋아요
    </button>

    <span>{likes}</span> {/* ⭐ 이게 핵심 */}
  </div>
</div>
  );
};

export default LpDetailPage;