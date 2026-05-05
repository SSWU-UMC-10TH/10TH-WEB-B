import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import Sidebar from "../components/SideBar";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";

const HomeLayout = () => {
    // 추가: 오직 사이드바 상태만 관리합니다.
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        // 수정: min-h-screen과 flex-col로 푸터 하단 고정 유지
        <div className="min-h-screen flex flex-col bg-[#121212] text-white">
            {/* 상단바: 고정 */}
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            
            <div className="flex flex-1 pt-16">
                {/* 사이드바: PC에서 고정, 모바일에서 토글 */}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* 메인 콘텐츠 영역 */}
                <main className="flex-1 p-6 relative">
                    <Outlet /> {/* 여기에 HomePage 등이 렌더링됨 */}
                    
                    {/* 플로팅 버튼 */}
                    <button 
                        onClick={() => navigate('/upload')} 
                        className="fixed bottom-10 right-8 w-14 h-14 bg-[#FF1781] rounded-full flex items-center justify-center text-3xl font-bold shadow-lg hover:scale-110 transition-transform z-50 cursor-pointer"
                    >
                        +
                    </button>
                </main>
            </div>

            {/* 푸터: 스크롤 시 맨 아래 유지 */}
            <Footer />
        </div>
    )
}

export default HomeLayout;