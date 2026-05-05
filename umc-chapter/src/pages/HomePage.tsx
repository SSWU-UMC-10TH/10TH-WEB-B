import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";

const HomePage = () => {
    const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);
    const navigate = useNavigate();
    
    const { data, isLoading, isError, refetch } = useGetLpList({ categoryId: 1 });

    const lpList = (Array.isArray(data) ? [...data] : []).sort((a, b) => {
        return order === PAGINATION_ORDER.DESC
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* 정렬 버튼: 로딩/에러와 상관없이 항상 노출되어야 합니다. */}
            <div className="flex justify-end mb-6">
                <div className="bg-gray-800 p-1 rounded-lg flex text-xs">
                    <button 
                        onClick={() => setOrder(PAGINATION_ORDER.ASC)}
                        className={`px-4 py-1.5 rounded-md transition-all ${order === PAGINATION_ORDER.ASC ? "bg-white text-black font-bold" : "text-gray-400"}`}
                    >
                        오래된순
                    </button>
                    <button 
                        onClick={() => setOrder(PAGINATION_ORDER.DESC)}
                        className={`px-4 py-1.5 rounded-md transition-all ${order === PAGINATION_ORDER.DESC ? "bg-white text-black font-bold" : "text-gray-400"}`}
                    >
                        최신순
                    </button>
                </div>
            </div>

            {/* 상태별 조건부 렌더링 */}
            {isLoading ? (
                <div className="text-center py-20 text-white">LP판을 돌리는 중...</div>
            ) : isError ? (
                <div className="text-center py-20">
                    <p className="text-white mb-4">데이터를 불러오지 못했습니다.</p>
                    <button onClick={() => refetch()} className="bg-[#FF1781] px-4 py-2 rounded text-white">재시도</button>
                </div>
            ) : (
                /* 카드 그리드 */
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {lpList.map((lp) => (
                        <div 
                            key={lp.id}
                            onClick={() => navigate(`/lp/${lp.id}`)}
                            className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-900 rounded-lg"
                        >
                            {/* thumbnail 필드가 없으므로 기본 이미지 노출 */}
                            <img 
                                src={"https://via.placeholder.com/300/121212/FFFFFF?text=No+Image"} 
                                alt={lp.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <h3 className="font-bold text-white text-sm truncate">{lp.title}</h3>
                                <p className="text-[10px] text-gray-400 mt-1">{new Date(lp.createdAt).toLocaleDateString()}</p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-white">
                                    <span>❤️</span> {lp.totalLikes || 0}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;