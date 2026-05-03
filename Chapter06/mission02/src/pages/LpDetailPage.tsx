import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { axiosInstance } from "../apis/axios";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteComments from "../hooks/queries/useGetInfiniteComments";
import type { LpDetail } from "../types/lp";

const COMMENT_PAGE_LIMIT = 10;

const getLpDetail = async (lpid: string): Promise<LpDetail> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);
    return data.data;
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
    const [searchParams, setSearchParams] = useSearchParams();
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
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useGetInfiniteComments(lpid, COMMENT_PAGE_LIMIT, commentOrder);

    const { ref: commentsBottomRef, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

    const comments = commentsData?.pages.flatMap((page) => page.data.data) ?? [];

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

                    <div className="flex flex-wrap gap-3 pt-2">
                        <button className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
                            수정
                        </button>
                        <button className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">
                            삭제
                        </button>
                        <button className="rounded bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600">
                            좋아요 {lp.likes.length}
                        </button>
                    </div>
                </article>
            </section>

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

                <form className="mb-6 rounded-xl border border-zinc-800 bg-black p-4">
                    <label htmlFor="comment" className="mb-2 block text-sm font-semibold text-zinc-200">
                        댓글 작성
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        placeholder="댓글을 입력해주세요."
                        className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-pink-400 focus:outline-none"
                    />
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-zinc-500">1자 이상 입력하면 등록할 수 있습니다.</p>
                        <button
                            type="button"
                            className="rounded-md bg-pink-500 px-5 py-2 text-sm font-bold text-white hover:bg-pink-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                        >
                            댓글 등록
                        </button>
                    </div>
                </form>

                {isCommentsError && (
                    <p className="mb-4 text-sm text-red-400">댓글을 불러오지 못했습니다.</p>
                )}

                {isCommentsLoading ? (
                    <CommentSkeletonList />
                ) : comments.length > 0 ? (
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <article
                                key={comment.id}
                                className="rounded-xl border border-zinc-800 bg-black p-4"
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
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <strong className="text-sm">{comment.author.name}</strong>
                                            <span className="text-xs text-zinc-500">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
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


