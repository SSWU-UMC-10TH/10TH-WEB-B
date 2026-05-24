import { data, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { Heart } from "lucide-react";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import { deleteLike, postLike } from "../apis/lp";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const { accessToken } = useAuth();
  const {
    data: lp,
    isPending,
    isError,
  } = useGetLpDetail({ lpId: Number(lpId) });

  const { data: me } = useGetMyInfo(accessToken);
  //mutate->비동기 요펑을 실행하고, 콜백함수를 이용해서 후속작업 처리함
  //mutateAsync -> promise를 반환해서 await 사용가능
  const { mutate: likeMutate, mutateAsync } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();

  //const isLiked = lp?.data.likes
  //  .map((like) => like.userId)
  //  .includes(me?.data.id as number);
  const isLiked = lp?.data.likes.some((like) => like.userId === me?.data.id);

  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) });
  };

  const handleDislikeLp = () => {
    disLikeMutate({ lpId: Number(lpId) });
  };

  if (isPending && isError) {
    return <></>;
  }

  return (
    <div className={"mt-12"}>
      <h1>{lp?.data.id}</h1>
      <h1>{lp?.data.title}</h1>
      <img src={lp?.data.thumbnail} alt={lp?.data.title} />
      <p>{lp?.data.content}</p>

      <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
        <Heart
          color={isLiked ? "red" : "black"}
          fill={isLiked ? "red" : "black"}
        />
      </button>
    </div>
  );
};

export default LpDetailPage;
