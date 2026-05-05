// src/components/Sidebar.tsx
import { Link } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    return (
        <>
            {/* 오버레이: 모바일에서 사이드바 외부 클릭 시 닫기 */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
            )}

            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-[#121212] border-r border-gray-800 z-50 transition-transform duration-300
                lg:translate-x-0 lg:static lg:block
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-8 space-y-8 mt-16 lg:mt-0">
                    <div className="space-y-6">
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">찾기</div>
                        <Link to="/me" className="block text-sm hover:text-[#FF1781]">마이페이지</Link>
                    </div>
                    
                    <button className="absolute bottom-10 left-8 text-xs text-gray-600 hover:text-white">
                        탈퇴하기
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;