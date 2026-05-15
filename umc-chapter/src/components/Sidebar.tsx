import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteMe } from "../apis/user";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const deleteMutation = useMutation({
        mutationFn: () => deleteMe(user!.id),
        onSuccess: async () => {
            await logout();
            navigate("/login");
        },
        onError: () => {
            alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
        },
    });

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}

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

                    <button
                        onClick={() => setShowConfirm(true)}
                        className="absolute bottom-10 left-8 text-xs text-gray-600 hover:text-white"
                    >
                        탈퇴하기
                    </button>
                </div>
            </aside>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
                    <div className="bg-[#1e1e1e] rounded-xl p-8 w-80 relative">
                        <button onClick={() => setShowConfirm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
                        <p className="text-white text-center mb-6">정말 탈퇴하시겠습니까?</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => deleteMutation.mutate()}
                                disabled={deleteMutation.isPending}
                                className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm disabled:opacity-50"
                            >
                                예
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-6 py-2 bg-[#FF1781] text-white rounded hover:bg-[#e61574] text-sm"
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;