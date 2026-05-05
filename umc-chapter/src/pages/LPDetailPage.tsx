import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import { QUERY_KEY } from "../constants/key";

const LpDetailPage = () => {
    const { lpId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: [QUERY_KEY.lps, lpId],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`v1/lps/${lpId}`);
            return data.data ?? data;
        },
        enabled: !!lpId,
    });

    if (isLoading) return <div className="text-center py-20 text-white">LP판을 돌리는 중...</div>;
    if (isError || !data) return (
        <div className="text-center py-20">
            <p className="text-white mb-4">데이터를 불러오지 못했습니다.</p>
            <button onClick={() => navigate('/')} className="bg-[#FF1781] px-4 py-2 rounded text-white">홈으로</button>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 text-white">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-6 text-sm">← 뒤로가기</button>

            {/* 썸네일 */}
            <div className="w-full aspect-square bg-gray-900 rounded-xl overflow-hidden mb-6">
                <img
                    src={data.thumbnail ?? "https://via.placeholder.com/600/121212/FFFFFF?text=No+Image"}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 메타 정보 */}
            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
            <p className="text-gray-400 text-sm mb-4">{new Date(data.createdAt).toLocaleDateString()}</p>

            {/* 좋아요 */}
            <div className="flex items-center gap-2 mb-6">
                <button className="flex items-center gap-1 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition">
                    <span>❤️</span>
                    <span className="text-sm">{data.totalLikes ?? 0}</span>
                </button>
            </div>

            {/* 본문 */}
            <p className="text-gray-300 leading-relaxed">{data.description ?? data.content}</p>

            {/* 수정/삭제 버튼 */}
            <div className="flex gap-3 mt-8">
                <button className="bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-600 transition">수정</button>
                <button className="bg-red-700 px-4 py-2 rounded text-sm hover:bg-red-600 transition">삭제</button>
            </div>
        </div>
    );
};

export default LpDetailPage;