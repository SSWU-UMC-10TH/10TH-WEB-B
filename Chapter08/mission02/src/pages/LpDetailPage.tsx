import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { axiosInstance } from "../apis/axios";
import {
    deleteLp,
    deleteLpComment,
    deleteLpLike,
    patchLp,
    patchLpComment,
    postLpComment,
    postLpLike,
} from "../apis/lp";
import { postImage } from "../apis/upload";
import { QUERY_KEY } from "../constants/key";
import { useAuth } from "../context/auth";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteComments from "../hooks/queries/useGetInfiniteComments";
import type { Likes, LpDetail } from "../types/lp";

const COMMENT_PAGE_LIMIT = 10;

const getLpDetail = async (lpid: string): Promise<LpDetail> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
    return data.data;
};

const getCommentErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
        return "로그인이 만료되었거나 인증 정보가 없습니다. 다시 로그인해주세요.";
    }

    return fallbackMessage;
};

const createOptimisticLike = (targetLpid: string | number, targetUserId: number): Likes => ({
    id: -targetUserId,
    userId: targetUserId,
    lpId: Number(targetLpid),
});

const updateLpLikeState = (
    lp: LpDetail,
    targetLpid: string | number,
    targetUserId: number,
    shouldLike: boolean,
): LpDetail => {
    const alreadyLiked = lp.likes.some((like) => like.userId === targetUserId);

    if (shouldLike) {
        if (alreadyLiked) return lp;

        return {
            ...lp,
            likes: [...lp.likes, createOptimisticLike(targetLpid, targetUserId)],
        };
    }

    if (!alreadyLiked) return lp;

    return {
        ...lp,
        likes: lp.likes.filter((like) => like.userId !== targetUserId),
    };
};

const LpDetailSkeleton = () => {
    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-8 md:grid-cols-[minmax(280px,420px)_1fr]">
                <div className="aspect-square animate-pulse rounded-lg bg-zinc-800" />
                <div className="space-y-4">
                    <div className="h-9 w-2/3 animate-pulse rounded bg-zinc-800" />
                    <div className="h-5 w-1/3 animate-pulse rounded bg-zinc-800" />
                    <div className="h-24 w-full animate-pulse rounded bg-zinc-800" />
                    <div className="h-10 w-56 animate-pulse rounded bg-zinc-800" />
                </div>
            </div>
        </div>
    );
};

const CommentSkeletonList = () => (
    <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex gap-3">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-zinc-800" />
                    <div className="flex-1 space-y-3">
                        <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
                        <div className="h-4 w-full animate-pulse rounded bg-zinc-800" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const LpDetailPage = () => {
    const { lpid } = useParams();
    const queryClient = useQueryClient();
    const { userId } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [commentContent, setCommentContent] = useState("");
    const [commentErrorMessage, setCommentErrorMessage] = useState("");
    const [openMenuCommentId, setOpenMenuCommentId] = useState<number | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [isLpEditModalOpen, setIsLpEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editTagInput, setEditTagInput] = useState("");
    const [editTags, setEditTags] = useState<string[]>([]);
    const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
    const [editThumbnailPreviewUrl, setEditThumbnailPreviewUrl] = useState("");
    const [lpActionErrorMessage, setLpActionErrorMessage] = useState("");
    const commentOrderParam = searchParams.get("commentOrder");
    const commentOrder =
        commentOrderParam === PAGINATION_ORDER.asc || commentOrderParam === PAGINATION_ORDER.desc
            ? commentOrderParam
            : PAGINATION_ORDER.desc;

    const handleCommentOrderChange = (order: PAGINATION_ORDER) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("commentOrder", order);
            return next;
        });
    };

    const {
        data: lp,
        isPending,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["lp", lpid],
        queryFn: () => getLpDetail(lpid!),
        enabled: !!lpid,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const {
        data: commentsData,
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        error: commentsError,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useGetInfiniteComments(lpid, COMMENT_PAGE_LIMIT, commentOrder);

    const { ref: commentsBottomRef, inView } = useInView();
    const currentUserId = userId;

    const invalidateComments = async () => {
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lpComments, lpid] });
    };

    const invalidateLpDetail = async () => {
        await queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
        await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    };

    const updateLikeOptimistically = async (targetLpid: string | number, shouldLike: boolean) => {
        const queryKey = ["lp", targetLpid] as const;
        await queryClient.cancelQueries({ queryKey });

        const previousLp = queryClient.getQueryData<LpDetail>(queryKey);

        if (currentUserId !== null) {
            queryClient.setQueryData<LpDetail>(queryKey, (prev) =>
                prev ? updateLpLikeState(prev, targetLpid, currentUserId, shouldLike) : prev,
            );
        }

        setLpActionErrorMessage("");

        return { previousLp };
    };

    const rollbackOptimisticLike = (targetLpid: string | number, previousLp?: LpDetail) => {
        if (previousLp) {
            queryClient.setQueryData(["lp", targetLpid], previousLp);
        }
    };

    const createCommentMutation = useMutation({
        mutationFn: postLpComment,
        onSuccess: async () => {
            setCommentContent("");
            setCommentErrorMessage("");
            await invalidateComments();
        },
        onError: (error) => {
            setCommentErrorMessage(getCommentErrorMessage(error, "댓글 등록에 실패했습니다."));
        },
    });

    const updateCommentMutation = useMutation({
        mutationFn: patchLpComment,
        onSuccess: async () => {
            setEditingCommentId(null);
            setEditingContent("");
            setOpenMenuCommentId(null);
            await invalidateComments();
        },
        onError: (error) => {
            setCommentErrorMessage(getCommentErrorMessage(error, "댓글 수정에 실패했습니다."));
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: deleteLpComment,
        onSuccess: async () => {
            setOpenMenuCommentId(null);
            await invalidateComments();
        },
        onError: (error) => {
            setCommentErrorMessage(getCommentErrorMessage(error, "댓글 삭제에 실패했습니다."));
        },
    });

    const uploadImageMutation = useMutation({
        mutationFn: postImage,
    });

    const updateLpMutation = useMutation({
        mutationFn: patchLp,
        onSuccess: async () => {
            setIsLpEditModalOpen(false);
            setEditThumbnailFile(null);
            setLpActionErrorMessage("");
            await invalidateLpDetail();
        },
        onError: (error) => {
            setLpActionErrorMessage(getCommentErrorMessage(error, "LP 수정에 실패했습니다."));
        },
    });

    const deleteLpMutation = useMutation({
        mutationFn: deleteLp,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
            window.location.href = "/";
        },
        onError: (error) => {
            setLpActionErrorMessage(getCommentErrorMessage(error, "LP 삭제에 실패했습니다."));
        },
    });

    const likeLpMutation = useMutation({
        mutationFn: postLpLike,
        onMutate: (targetLpid) => updateLikeOptimistically(targetLpid, true),
        onSuccess: () => {
            setLpActionErrorMessage("");
        },
        onError: (error, targetLpid, context) => {
            rollbackOptimisticLike(targetLpid, context?.previousLp);
            setLpActionErrorMessage(getCommentErrorMessage(error, "좋아요 처리에 실패했습니다."));
        },
        onSettled: async () => {
            await invalidateLpDetail();
        },
    });

    const unlikeLpMutation = useMutation({
        mutationFn: deleteLpLike,
        onMutate: (targetLpid) => updateLikeOptimistically(targetLpid, false),
        onSuccess: () => {
            setLpActionErrorMessage("");
        },
        onError: (error, targetLpid, context) => {
            rollbackOptimisticLike(targetLpid, context?.previousLp);
            setLpActionErrorMessage(getCommentErrorMessage(error, "좋아요 취소에 실패했습니다."));
        },
        onSettled: async () => {
            await invalidateLpDetail();
        },
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

    const comments = commentsData?.pages.flatMap((page) => page.data.data) ?? [];
    const isLiked = !!lp?.likes.some((like) => like.userId === currentUserId);
    const isCreatingComment = createCommentMutation.isPending;
    const isUpdatingComment = updateCommentMutation.isPending;
    const isDeletingComment = deleteCommentMutation.isPending;
    const isLpActionPending =
        updateLpMutation.isPending ||
        deleteLpMutation.isPending ||
        likeLpMutation.isPending ||
        unlikeLpMutation.isPending ||
        uploadImageMutation.isPending;

    const handleCreateComment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!lpid) return;

        const nextContent = commentContent.trim();
        if (!nextContent) {
            setCommentErrorMessage("댓글을 입력해주세요.");
            return;
        }

        createCommentMutation.mutate({
            lpId: lpid,
            content: nextContent,
        });
    };

    const handleStartEditComment = (commentId: number, content: string) => {
        setEditingCommentId(commentId);
        setEditingContent(content);
        setOpenMenuCommentId(null);
        setCommentErrorMessage("");
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditingContent("");
    };

    const handleUpdateComment = (commentId: number) => {
        if (!lpid) return;

        const nextContent = editingContent.trim();
        if (!nextContent) {
            setCommentErrorMessage("수정할 댓글을 입력해주세요.");
            return;
        }

        updateCommentMutation.mutate({
            lpId: lpid,
            commentId,
            content: nextContent,
        });
    };

    const handleDeleteComment = (commentId: number) => {
        if (!lpid || !window.confirm("댓글을 삭제하시겠습니까?")) return;

        deleteCommentMutation.mutate({
            lpId: lpid,
            commentId,
        });
    };

    const handleOpenLpEditModal = () => {
        if (!lp) return;

        setEditTitle(lp.title);
        setEditContent(lp.content);
        setEditTags(lp.tags.map((tag) => tag.name));
        setEditTagInput("");
        setEditThumbnailFile(null);
        setEditThumbnailPreviewUrl(lp.thumbnail);
        setLpActionErrorMessage("");
        setIsLpEditModalOpen(true);
    };

    const handleAddEditTag = () => {
        const nextTag = editTagInput.trim();

        if (!nextTag || editTags.includes(nextTag)) {
            setEditTagInput("");
            return;
        }

        setEditTags((prev) => [...prev, nextTag]);
        setEditTagInput("");
    };

    const handleEditThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        setEditThumbnailFile(file);

        if (file) {
            setEditThumbnailPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateLp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!lpid) return;

        if (editTags.length === 0) {
            setLpActionErrorMessage("태그를 1개 이상 추가해주세요.");
            return;
        }

        try {
            const thumbnail = editThumbnailFile
                ? (await uploadImageMutation.mutateAsync(editThumbnailFile)).data.imageUrl
                : editThumbnailPreviewUrl;

            updateLpMutation.mutate({
                lpid,
                title: editTitle.trim(),
                content: editContent.trim(),
                tags: editTags,
                published: true,
                thumbnail,
            });
        } catch {
            setLpActionErrorMessage("이미지 업로드에 실패했습니다.");
        }
    };

    const handleDeleteLp = () => {
        if (!lpid || !window.confirm("LP를 삭제하시겠습니까?")) return;

        deleteLpMutation.mutate({ lpid });
    };

    const handleToggleLike = () => {
        if (!lpid || isLpActionPending) return;

        if (isLiked) {
            unlikeLpMutation.mutate(lpid);
            return;
        }

        likeLpMutation.mutate(lpid);
    };

    if (isPending) {
        return <LpDetailSkeleton />;
    }

    if (isError || !lp) {
        return (
            <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center text-white">
                <p className="text-red-400">LP 정보를 불러오지 못했습니다.</p>
                <button
                    type="button"
                    onClick={() => void refetch()}
                    className="rounded-md border border-zinc-500 px-4 py-2 text-sm font-semibold hover:bg-zinc-900"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 text-white">
            <section className="grid gap-8 md:grid-cols-[minmax(280px,420px)_1fr]">
                <div className="overflow-hidden rounded-lg bg-zinc-900">
                    <img
                        src={lp.thumbnail}
                        alt={lp.title}
                        className="aspect-square w-full object-cover"
                    />
                </div>

                <article className="flex flex-col gap-6">
                    <header className="border-b border-zinc-800 pb-5">
                        <h1 className="text-3xl font-bold">{lp.title}</h1>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-300">
                            <span>작성자 {lp.author.name}</span>
                            <span>업로드일 {new Date(lp.createdAt).toLocaleDateString()}</span>
                            <span>좋아요 {lp.likes.length}</span>
                        </div>
                    </header>

                    <section>
                        <h2 className="mb-2 text-sm font-semibold text-zinc-400">본문</h2>
                        <p className="whitespace-pre-wrap leading-7 text-zinc-100">{lp.content}</p>
                    </section>

                    {lp.tags.length > 0 && (
                        <section className="flex flex-wrap gap-2">
                            {lp.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </section>
                    )}

                    {lpActionErrorMessage && (
                        <p className="text-sm text-red-400">{lpActionErrorMessage}</p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleOpenLpEditModal}
                            className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                        >
                            수정
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteLp}
                            disabled={deleteLpMutation.isPending}
                            className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                        >
                            {deleteLpMutation.isPending ? "삭제 중..." : "삭제"}
                        </button>
                        <button
                            type="button"
                            onClick={handleToggleLike}
                            disabled={isLpActionPending}
                            className={`rounded px-4 py-2 text-sm font-semibold text-white disabled:bg-zinc-700 disabled:text-zinc-400 ${
                                isLiked
                                    ? "bg-zinc-700 hover:bg-zinc-600"
                                    : "bg-pink-500 hover:bg-pink-600"
                            }`}
                        >
                            {isLiked ? "좋아요 취소" : "좋아요"} {lp.likes.length}
                        </button>
                    </div>
                </article>
            </section>

            {isLpEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
                    <form
                        onSubmit={handleUpdateLp}
                        className="w-full max-w-md rounded-lg bg-zinc-800 p-6 text-white shadow-2xl"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">LP 수정</h2>
                            <button
                                type="button"
                                onClick={() => setIsLpEditModalOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </div>

                        {editThumbnailPreviewUrl && (
                            <img
                                src={editThumbnailPreviewUrl}
                                alt="LP 미리보기"
                                className="mx-auto mb-5 h-36 w-36 rounded-full object-cover shadow-2xl"
                            />
                        )}

                        <div className="space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleEditThumbnailChange}
                                className="w-full cursor-pointer rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-pink-500 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-pink-600 focus:border-pink-400 focus:outline-none"
                            />
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(event) => setEditTitle(event.target.value)}
                                className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-pink-400 focus:outline-none"
                                placeholder="LP Name"
                            />
                            <textarea
                                value={editContent}
                                onChange={(event) => setEditContent(event.target.value)}
                                rows={4}
                                className="w-full resize-none rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-pink-400 focus:outline-none"
                                placeholder="LP Content"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={editTagInput}
                                    onChange={(event) => setEditTagInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleAddEditTag();
                                        }
                                    }}
                                    className="min-w-0 flex-1 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-pink-400 focus:outline-none"
                                    placeholder="LP Tag"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddEditTag}
                                    disabled={!editTagInput.trim()}
                                    className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:bg-zinc-600 disabled:text-zinc-400"
                                >
                                    태그 추가
                                </button>
                            </div>

                            {editTags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {editTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 rounded bg-zinc-700 px-2 py-1 text-xs font-semibold text-zinc-200"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setEditTags((prev) =>
                                                        prev.filter((item) => item !== tag),
                                                    )
                                                }
                                                className="flex h-4 w-4 items-center justify-center rounded-full text-zinc-300 hover:bg-zinc-600 hover:text-white"
                                                aria-label={`${tag} 태그 삭제`}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {lpActionErrorMessage && (
                                <p className="text-sm text-red-300">{lpActionErrorMessage}</p>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    !editTitle.trim() ||
                                    !editContent.trim() ||
                                    isLpActionPending
                                }
                                className="w-full rounded-md bg-slate-400 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-300 disabled:bg-zinc-600 disabled:text-zinc-400"
                            >
                                {isLpActionPending ? "수정 중..." : "수정 완료"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold">댓글</h2>
                        <p className="mt-1 text-sm text-zinc-400">
                            정렬을 바꾸면 첫 페이지부터 다시 불러옵니다.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleCommentOrderChange(PAGINATION_ORDER.asc)}
                            className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                commentOrder === PAGINATION_ORDER.asc
                                    ? "bg-white text-black"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                        >
                            오래된순
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCommentOrderChange(PAGINATION_ORDER.desc)}
                            className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                commentOrder === PAGINATION_ORDER.desc
                                    ? "bg-white text-black"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                            }`}
                        >
                            최신순
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={handleCreateComment}
                    className="mb-6 rounded-xl border border-zinc-800 bg-black p-4"
                >
                    <label htmlFor="comment" className="mb-2 block text-sm font-semibold text-zinc-200">
                        댓글 작성
                    </label>
                    <textarea
                        id="comment"
                        value={commentContent}
                        onChange={(event) => {
                            setCommentContent(event.target.value);
                            setCommentErrorMessage("");
                        }}
                        rows={4}
                        placeholder="댓글을 입력해주세요."
                        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-pink-400 focus:outline-none"
                    />
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-zinc-500">1자 이상 입력하면 등록할 수 있습니다.</p>
                        <button
                            type="submit"
                            disabled={!commentContent.trim() || isCreatingComment}
                            className="rounded-md bg-pink-500 px-5 py-2 text-sm font-bold text-white hover:bg-pink-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                        >
                            {isCreatingComment ? "등록 중..." : "댓글 등록"}
                        </button>
                    </div>
                </form>

                {commentErrorMessage && (
                    <p className="mb-4 text-sm text-red-400">{commentErrorMessage}</p>
                )}

                {isCommentsError && (
                    <p className="mb-4 text-sm text-red-400">
                        {getCommentErrorMessage(commentsError, "댓글을 불러오지 못했습니다.")}
                    </p>
                )}

                {isCommentsLoading ? (
                    <CommentSkeletonList />
                ) : comments.length > 0 ? (
                    <div className="space-y-3">
                        {comments.map((comment) => {
                            const isMyComment = currentUserId === comment.authorId;
                            const isEditing = editingCommentId === comment.id;

                            return (
                                <article
                                    key={comment.id}
                                    className="relative rounded-xl border border-zinc-800 bg-black p-4"
                                >
                                    <div className="flex gap-3">
                                        {comment.author.avatar ? (
                                            <img
                                                src={comment.author.avatar}
                                                alt={comment.author.name}
                                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-300">
                                                {comment.author.name.slice(0, 1)}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1 pr-10">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <strong className="text-sm">
                                                    {comment.author.name}
                                                </strong>
                                                <span className="text-xs text-zinc-500">
                                                    {new Date(
                                                        comment.createdAt,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {isEditing ? (
                                                <div className="mt-3 space-y-3">
                                                    <textarea
                                                        value={editingContent}
                                                        onChange={(event) =>
                                                            setEditingContent(event.target.value)
                                                        }
                                                        rows={3}
                                                        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-pink-400 focus:outline-none"
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={handleCancelEditComment}
                                                            className="rounded-md bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
                                                        >
                                                            취소
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdateComment(comment.id)
                                                            }
                                                            disabled={
                                                                !editingContent.trim() ||
                                                                isUpdatingComment
                                                            }
                                                            className="rounded-md bg-pink-500 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                                                        >
                                                            {isUpdatingComment
                                                                ? "수정 중..."
                                                                : "수정 완료"}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                                                    {comment.content}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isMyComment && !isEditing && (
                                        <div className="absolute right-4 top-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOpenMenuCommentId((prev) =>
                                                        prev === comment.id ? null : comment.id,
                                                    )
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                                aria-label="댓글 메뉴"
                                            >
                                                …
                                            </button>

                                            {openMenuCommentId === comment.id && (
                                                <div className="absolute right-0 top-9 z-10 w-24 overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 text-sm shadow-xl">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStartEditComment(
                                                                comment.id,
                                                                comment.content,
                                                            )
                                                        }
                                                        className="block w-full px-3 py-2 text-left text-zinc-200 hover:bg-zinc-800"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteComment(comment.id)
                                                        }
                                                        disabled={isDeletingComment}
                                                        className="block w-full px-3 py-2 text-left text-red-300 hover:bg-zinc-800 disabled:text-zinc-600"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="rounded-xl border border-dashed border-zinc-700 p-6 text-center text-sm text-zinc-500">
                        아직 댓글이 없습니다.
                    </p>
                )}

                {isFetchingNextPage && (
                    <div className="mt-3">
                        <CommentSkeletonList />
                    </div>
                )}

                <div ref={commentsBottomRef} className="h-8" />
            </section>
        </div>
    );
};

export default LpDetailPage;
