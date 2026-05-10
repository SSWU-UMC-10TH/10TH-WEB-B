import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteList from "../hooks/queries/useGetInfinite";
import { useAuth } from "../context/auth";
import LpSkeletonCard from "../components/LpSkeletonCard";

const SKELETON_CARD_COUNT = 12;

const LpSkeletonGrid = () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, idx) => (
            <LpSkeletonCard key={idx} />
        ))}
    </div>
);

const HomePage = () => {
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.asc);
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const {
        data,
        isFetchingNextPage,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
    } = useGetInfiniteList(20, order);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

    const lpList = data?.pages.flatMap((page) => page.data.data) ?? [];

    const handleCardClick = (id: number) => {
        if (!accessToken) {
            if (window.confirm("로그인이 필요한 서비스입니다.\n로그인 화면으로 이동할까요?")) {
                navigate("/login");
            }
            return;
        }
        navigate(`/lp/${id}`);
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <div className="mt-10 px-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="space-x-2">
                            <button
                                onClick={() => setOrder(PAGINATION_ORDER.asc)}
                                className={`rounded px-4 py-2 ${
                                    order === PAGINATION_ORDER.asc
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                오래된순
                            </button>
                            <button
                                onClick={() => setOrder(PAGINATION_ORDER.desc)}
                                className={`rounded px-4 py-2 ${
                                    order === PAGINATION_ORDER.desc
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                최신순
                            </button>
                        </div>
                    </div>

                    {isError && <p>데이터를 불러오지 못했습니다.</p>}

                    {isLoading ? (
                        <LpSkeletonGrid />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                {lpList.map((lp) => (
                                    <div
                                        onClick={() => handleCardClick(lp.id)}
                                        key={lp.id}
                                        className="group relative overflow-hidden rounded text-white transition duration-300 hover:scale-105"
                                    >
                                        <img
                                            src={lp.thumbnail}
                                            alt={lp.title}
                                            className="aspect-square w-full object-cover"
                                        />
                                        <div
                                            className="absolute inset-0 flex flex-col items-start justify-end space-y-1 bg-black/70 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        >
                                            <h3 className="text-lg font-bold">{lp.title}</h3>
                                            <p className="mt-1 text-sm">
                                                [업로드 날짜]{" "}
                                                {new Date(lp.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm">
                                                [Likes] {lp.likes?.length || 0}개
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {isFetchingNextPage && (
                                <div className="mt-4">
                                    <LpSkeletonGrid />
                                </div>
                            )}
                        </>
                    )}

                    <div ref={ref} className="h-10" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
