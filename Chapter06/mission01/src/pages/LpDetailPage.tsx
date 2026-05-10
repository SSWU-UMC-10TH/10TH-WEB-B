import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import type { LpDetail } from "../types/lp";

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

const LpDetailPage = () => {
    const { lpid } = useParams();

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
        </div>
    );
};

export default LpDetailPage;
