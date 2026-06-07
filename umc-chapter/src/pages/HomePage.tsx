import { useNavigate, useOutletContext } from "react-router-dom";
import { useRef, useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../enums/common";
import useGetLpList from "../hooks/queries/useGetLpList";
import { postLp } from "../apis/lp";
import { QUERY_KEY } from "../constants/key";
import useDebounce from "../hooks/useDebounce";

interface OutletContext {
    isLpModalOpen: boolean;
    setIsLpModalOpen: (v: boolean) => void;
}

const HomePage = () => {
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isLpModalOpen, setIsLpModalOpen } = useOutletContext<OutletContext>();
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const observerRef = useRef<HTMLDivElement>(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetLpList({
        categoryId: 1,
        order,
        search: debouncedSearch,
    });

    // 무한스크롤 - IntersectionObserver
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    useEffect(() => {
        const element = observerRef.current;
        if (!element) return;
        const observer = new IntersectionObserver(handleObserver, { threshold: 0.5 });
        observer.observe(element);
        return () => observer.disconnect();
    }, [handleObserver]);

    const lpList = data?.pages.flatMap((page) => {
    console.log("page 전체:", page);  // 실제 구조 확인
    const inner = (page as any)?.data ?? (page as any);
    return Array.isArray(inner) ? inner : (inner?.data ?? []);
}) ?? [];

    const sorted = [...lpList].sort((a, b) =>
        order === PAGINATION_ORDER.DESC
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const [lpName, setLpName] = useState("");
    const [lpContent, setLpContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags([...tags, t]);
        setTagInput("");
    };

    const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

    const closeModal = () => {
        setIsLpModalOpen(false);
        setLpName(""); setLpContent(""); setTagInput(""); setTags([]);
    };

    const createLpMutation = useMutation({
        mutationFn: () => postLp({ title: lpName, description: lpContent, categoryId: 1, tags }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
            closeModal();
        },
        onError: () => alert("LP 생성에 실패했습니다."),
    });

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* 검색창 */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="타입스크립트"
                        className="w-full bg-gray-800 text-white text-sm pl-9 pr-4 py-2 rounded-lg outline-none border border-gray-700 focus:border-[#FF1781]"
                    />
                </div>
                <button className="bg-gray-700 text-white text-xs px-4 py-2 rounded-lg">검색</button>
            </div>

            {/* 정렬 */}
            <div className="flex justify-end mb-6">
                <div className="bg-gray-800 p-1 rounded-lg flex text-xs">
                    <button
                        onClick={() => setOrder(PAGINATION_ORDER.ASC)}
                        className={`px-4 py-1.5 rounded-md transition-all ${order === PAGINATION_ORDER.ASC ? "bg-white text-black font-bold" : "text-gray-400"}`}
                    >오래된순</button>
                    <button
                        onClick={() => setOrder(PAGINATION_ORDER.DESC)}
                        className={`px-4 py-1.5 rounded-md transition-all ${order === PAGINATION_ORDER.DESC ? "bg-white text-black font-bold" : "text-gray-400"}`}
                    >최신순</button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-white">LP판을 돌리는 중...</div>
            ) : isError ? (
                <div className="text-center py-20">
                    <p className="text-white mb-4">데이터를 불러오지 못했습니다.</p>
                    <button onClick={() => refetch()} className="bg-[#FF1781] px-4 py-2 rounded text-white">재시도</button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sorted.map((lp) => (
                            <div
                                key={lp.id}
                                onClick={() => navigate(`/lp/${lp.id}`)}
                                className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-900 rounded-lg"
                            >
                                <img
                                    src={lp.thumbnail ?? "https://via.placeholder.com/300/121212/FFFFFF?text=No+Image"}
                                    alt={lp.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <h3 className="font-bold text-white text-sm truncate">{lp.title}</h3>
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(lp.createdAt).toLocaleDateString()}</p>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-white">
                                        <span>❤️</span> {lp.totalLikes ?? lp.likes?.length ?? 0}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 무한스크롤 트리거 */}
                    <div ref={observerRef} className="h-10 mt-4" />
                    {isFetchingNextPage && (
                        <div className="text-center py-4 text-gray-400 text-sm">불러오는 중...</div>
                    )}
                </>
            )}

            {/* LP 생성 모달 — 기존과 동일 */}
            {isLpModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={closeModal}>
                    <div className="bg-[#1e1e1e] rounded-xl p-6 w-96 relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <div className="w-32 h-32 mx-auto mb-4 bg-gray-800 rounded-full overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => fileRef.current?.click()}>
                            {thumbnail
                                ? <img src={URL.createObjectURL(thumbnail)} alt="thumb" className="w-full h-full object-cover" />
                                : <span className="text-4xl">🎵</span>}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)} />
                        <div className="flex flex-col gap-3">
                            <input value={lpName} onChange={(e) => setLpName(e.target.value)} placeholder="LP Name" className="bg-transparent border-b border-gray-600 text-white text-sm py-2 outline-none" />
                            <input value={lpContent} onChange={(e) => setLpContent(e.target.value)} placeholder="LP Content" className="bg-transparent border-b border-gray-600 text-white text-sm py-2 outline-none" />
                            <div className="flex gap-2">
                                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} placeholder="LP Tag" className="flex-1 bg-transparent border-b border-gray-600 text-white text-sm py-2 outline-none" />
                                <button onClick={addTag} className="bg-[#FF1781] text-white text-xs px-3 py-1 rounded">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span key={tag} className="flex items-center gap-1 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-white">✕</button>
                                    </span>
                                ))}
                            </div>
                            <button onClick={() => createLpMutation.mutate()} disabled={!lpName.trim() || createLpMutation.isPending} className="w-full bg-[#FF1781] text-white py-2 rounded mt-2 text-sm disabled:opacity-50 hover:bg-[#e61574]">
                                Add LP
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;