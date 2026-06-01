import { useParams } from "react-router-dom";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  console.log(id);
  return (
    <div>
      영화상세 페이지 입니다.
      <h1 className="">오타니안 파이팅</h1>
      <h1>{id}번 영화 상세페이지를 패칭해옵니다.</h1>
    </div>
  );
}
