import { data, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { Heart } from "lucide-react";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import { deleteLike, postLike } from "../apis/lp";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { useState } from "react";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const [order, setOrder] = useState<"latest" | "oldest">("latest");
  const [content, setContent] = useState("");
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
    likeMutate(
      { lpId: Number(lpId) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["lpDetail", Number(lpId)],
          });
        },
      }
    );
  };

  const handleDislikeLp = () => {
    disLikeMutate(
      { lpId: Number(lpId) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["lpDetail", Number(lpId)],
          });
        },
      }
    );
  };

  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axios.get(
        `http://localhost:8000/v1/lps/${lpId}/comments`,
        {
          params: { cursor: pageParam, order },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.hasNext === false) return undefined;
      return lastPage.nextCursor;
    },
  });

  const { mutate: postComment } = useMutation({
    mutationFn: (newContent: string) =>
      axios.post(
        `http://localhost:8000/v1/lps/${lpId}/comments`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
    onError: (error) => {
      console.error("댓글 등록 에러:", error);
      alert("댓글 등록에 실패했습니다.");
    },
  });

  if (isPending && isError) {
    return <></>;
  }

  return (
    <div className={"mt-12"}>
      <h1>{lp?.data.id}</h1>
      <h1>{lp?.data.title}</h1>
      <img src={lp?.data.thumbnail} alt={lp?.data.title} />
      <p>{lp?.data.content}</p>

      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={isLiked ? handleDislikeLp : handleLikeLp}
          className="transition-transform active:scale-90"
        >
          <Heart
            color={isLiked ? "red" : "gray"}
            fill={isLiked ? "red" : "gray"}
            size={28}
          />
        </button>
        <span className="text-lg font-semibold">
          {lp?.data.likes?.length || 0}
        </span>
      </div>

      <hr className="border-gray-800 mb-8" />

      <div className="comment-section">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">댓글</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setOrder("oldest")}
              className={`text-xs px-2 py-1 rounded ${
                order === "oldest"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setOrder("latest")}
              className={`text-xs px-2 py-1 rounded ${
                order === "latest"
                  ? "bg-white text-black"
                  : "bg-gray-800 text-white"
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="댓글을 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-white"
          />
          <button
            onClick={() => postComment(content)}
            className="bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-600"
          >
            작성
          </button>
        </div>

        <div className="space-y-4">
          {commentData?.pages?.map((page) =>
            page?.data?.map((comment: any) => (
              <div
                key={comment.id}
                className="flex gap-3 items-start pb-4 border-b border-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-pink-500 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold">
                    {comment.author?.name}
                  </div>
                  <div className="text-sm text-gray-300">{comment.content}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full py-4 text-sm text-gray-500"
          >
            {isFetchingNextPage ? "로딩 중..." : "더보기"}
          </button>
        )}
      </div>
    </div>
  );
};

export default LpDetailPage;
