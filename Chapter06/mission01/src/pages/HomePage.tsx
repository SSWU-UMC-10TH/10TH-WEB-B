import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common.ts";
import { useAuth } from "../context/auth";
import type { PaginationDto } from "../types/common";
import type { LpSummary } from "../types/lp";

const skeletonItems = Array.from({ length: 18 });

const HomePage = () => {
    const [sort, setSort] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
    const navigate = useNavigate();
    const { accessToken } = useAuth();

    const queryParams: PaginationDto = {
        cursor: undefined,
        order: sort,
        limit: 50,
    };

    const { data, isPending, isError, isFetching, refetch } = useGetLpList(queryParams);
    const lpList: LpSummary[] = data?.data?.data || [];

    const handleCardClick = (id: number) => {
        if (!accessToken) {
            if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 화면으로 이동할까요?")) {
                navigate("/login");
            }
            return;
        }

        navigate(`/lp/${id}`);
    };

    const handleCreateClick = () => {
        if (!accessToken) {
            navigate("/login");
            return;
        }

        navigate("/lp/create");
    };

    return (
        <div className="relative min-h-[calc(100dvh-4rem)] bg-black text-white">
            <div className="px-4 py-6 sm:px-6 lg:px-10">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="text-sm text-zinc-400">
                        {isFetching && !isPending ? "목록 갱신 중..." : null}
                    </div>
                    <div className="flex overflow-hidden rounded-md border border-zinc-600 text-sm font-semibold">
                        <button
                            type="button"
                            onClick={() => setSort(PAGINATION_ORDER.desc)}
                            className={`px-4 py-2 ${
                                sort === PAGINATION_ORDER.desc
                                    ? "bg-white text-black"
                                    : "bg-black text-white hover:bg-zinc-900"
                            }`}
                        >
                            최신순
                        </button>
                        <button
                            type="button"
                            onClick={() => setSort(PAGINATION_ORDER.asc)}
                            className={`px-4 py-2 ${
                                sort === PAGINATION_ORDER.asc
                                    ? "bg-white text-black"
                                    : "bg-black text-white hover:bg-zinc-900"
                            }`}
                        >
                            오래된순
                        </button>
                    </div>
                </div>

                {isPending && (
                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {skeletonItems.map((_, index) => (
                            <div key={index} className="aspect-square animate-pulse bg-zinc-800" />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="flex flex-col items-center gap-4 py-20 text-center">
                        <p className="text-red-400">LP 목록을 불러오지 못했습니다.</p>
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            className="rounded-md border border-zinc-500 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-900"
                        >
                            다시 시도
                        </button>
                    </div>
                )}

                {!isPending && !isError && (
                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {lpList.map((lp) => (
                            <button
                                type="button"
                                onClick={() => handleCardClick(lp.id)}
                                key={lp.id}
                                className="group relative aspect-square cursor-pointer overflow-hidden bg-zinc-900 text-left text-white outline-none transition-transform duration-300 hover:z-[1] hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-pink-400"
                            >
                                <img
                                    src={lp.thumbnail}
                                    alt={lp.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/55 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-4">
                                    <h3 className="line-clamp-1 text-sm font-bold sm:text-base">
                                        {lp.title}
                                    </h3>
                                    <div className="mt-2 flex w-full items-center justify-between gap-3 text-xs font-medium text-zinc-200 sm:text-sm">
                                        <span className="truncate">
                                            {new Date(lp.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="shrink-0">좋아요 {lp.likes?.length || 0}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={handleCreateClick}
                className="fixed bottom-8 right-8 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-semibold text-white shadow-lg hover:bg-pink-400"
                aria-label="LP 작성"
            >
                +
            </button>
        </div>
    );
};

export default HomePage;
