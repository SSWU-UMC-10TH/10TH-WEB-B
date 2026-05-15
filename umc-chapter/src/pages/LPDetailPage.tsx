import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import { deleteLp, postLike, deleteLike, getComments, postComment, putComment, deleteComment } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";
import { useAuth } from "../contexts/AuthContext";

const LpDetailPage = () => {
    const { lpId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const id = Number(lpId);

    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEY.lps, lpId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`v1/lps/${lpId}`);
            return data.data ?? data;
        },
        enabled: !!lpId,
    });

    const [commentOrder, setCommentOrder] = useState("desc");
    const { data: comments = [] } = useQuery({
        queryKey: [QUERY_KEY.comments, lpId, commentOrder],
        queryFn: async () => {
            const res = await getComments({ lpId: id, order: commentOrder });
            return Array.isArray(res) ? res : (res.data ?? []);
        },
        enabled: !!lpId,
    });

    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const liked = data?.likes?.some((l: { userId: number }) => l.userId === user?.id);

    const deleteLpMutation = useMutation({
        mutationFn: () => deleteLp(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
            navigate("/");
        },
    });

    const likeMutation = useMutation({
        mutationFn: () => liked ? deleteLike(id) : postLike(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps, lpId] }),
    });

    const postCommentMutation = useMutation({
        mutationFn: () => postComment({ lpId: id, content: commentText }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] });
            setCommentText("");
        },
    });

    const putCommentMutation = useMutation({
        mutationFn: (commentId: number) => putComment({ lpId: id, commentId, content: editingText }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] });
            setEditingCommentId(null);
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) => deleteComment({ lpId: id, commentId }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] }),
    });

    if (isLoading) return <div className="text-center py-20 text-white">LP판을 돌리는 중...</div>;
    if (isError || !data) return (
        <div className="text-center py-20">
            <p className="text-white mb-4">데이터를 불러오지 못했습니다.</p>
            <button onClick={() => navigate('/')} className="bg-[#FF1781] px-4 py-2 rounded text-white">홈으로</button>
        </div>
    );

    const isOwner = user?.id === data.authorId;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 text-white">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-6 text-sm">← 뒤로가기</button>

            <div className="w-full aspect-square bg-gray-900 rounded-xl overflow-hidden mb-6">
                <img
                    src={data.thumbnail ?? "https://via.placeholder.com/600/121212/FFFFFF?text=No+Image"}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
            <p className="text-gray-400 text-sm mb-4">{new Date(data.createdAt).toLocaleDateString()}</p>

            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => likeMutation.mutate()}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full transition ${liked ? "bg-[#FF1781]" : "bg-gray-800 hover:bg-gray-700"}`}
                >
                    <span>❤️</span>
                    <span className="text-sm">{data.totalLikes ?? data.likes?.length ?? 0}</span>
                </button>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">{data.description ?? data.content}</p>

            {isOwner && (
                <div className="flex gap-3 mt-4 mb-10">
                    <button className="bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-600 transition">수정</button>
                    <button onClick={() => deleteLpMutation.mutate()} disabled={deleteLpMutation.isPending} className="bg-red-700 px-4 py-2 rounded text-sm hover:bg-red-600 transition">삭제</button>
                </div>
            )}

            <div className="border-t border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold">댓글</h2>
                    <div className="flex gap-2 text-xs">
                        <button onClick={() => setCommentOrder("asc")} className={`px-3 py-1 rounded ${commentOrder === "asc" ? "bg-white text-black" : "bg-gray-700 text-gray-300"}`}>오래된순</button>
                        <button onClick={() => setCommentOrder("desc")} className={`px-3 py-1 rounded ${commentOrder === "desc" ? "bg-white text-black" : "bg-gray-700 text-gray-300"}`}>최신순</button>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="댓글을 입력해주세요"
                        className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                    />
                    <button
                        onClick={() => postCommentMutation.mutate()}
                        disabled={!commentText.trim() || postCommentMutation.isPending}
                        className="bg-[#FF1781] px-4 py-2 rounded text-sm disabled:opacity-50"
                    >
                        작성
                    </button>
                </div>

                <div className="space-y-4">
                    {comments.map((c: {
                        id: number;
                        content: string;
                        userId?: number;
                        author?: { id: number; name: string };
                        user?: { id: number; name: string };
                    }) => {
                        const authorId = c.author?.id ?? c.user?.id ?? c.userId;
                        const authorName = c.author?.name ?? c.user?.name ?? "익명";
                        const isMyComment = authorId !== undefined && authorId === user?.id;

                        return (
                            <div key={c.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{authorName}</p>
                                    {editingCommentId === c.id ? (
                                        <div className="flex gap-2 mt-1">
                                            <input
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                                            />
                                            <button onClick={() => putCommentMutation.mutate(c.id)} className="text-[#FF1781] text-sm">✓</button>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-300 mt-1">{c.content}</p>
                                    )}
                                </div>

                                {isMyComment && (
                                    <div className="relative">
                                        <button onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)} className="text-gray-400 text-lg">⋮</button>
                                        {openMenuId === c.id && (
                                            <div className="absolute right-0 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 w-20">
                                                <button
                                                    onClick={() => { setEditingCommentId(c.id); setEditingText(c.content); setOpenMenuId(null); }}
                                                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-700"
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => { deleteCommentMutation.mutate(c.id); setOpenMenuId(null); }}
                                                    className="block w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LpDetailPage;