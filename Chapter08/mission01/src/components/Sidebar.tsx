import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deleteMe } from "../apis/auth";
import { useAuth } from "../context/auth";

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    const navigate = useNavigate();
    const { accessToken, clearAuth } = useAuth();
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const withdrawMutation = useMutation({
        mutationFn: deleteMe,
        onSuccess: () => {
            clearAuth();
            setIsWithdrawModalOpen(false);
            onClose?.();
            navigate("/login");
        },
        onError: () => {
            alert("회원 탈퇴에 실패했습니다.");
        },
    });

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="사이드바 닫기"
                    onClick={onClose}
                    className="fixed inset-0 z-10 bg-black/60 md:hidden"
                />
            )}

            <aside
                className={`fixed bottom-0 left-0 top-16 z-10 w-40 border-r border-zinc-800 bg-black text-white transition-transform duration-200 md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <nav className="px-6 py-6 text-sm font-semibold">
                    <Link to="/search" onClick={onClose} className="block py-3 hover:text-pink-400">
                        찾기
                    </Link>
                    <Link to="/my" onClick={onClose} className="block py-3 hover:text-pink-400">
                        마이페이지
                    </Link>
                </nav>
                {accessToken && (
                    <button
                        type="button"
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="absolute bottom-0 px-6 py-8 text-left text-sm font-semibold text-zinc-300 hover:text-pink-400"
                    >
                        탈퇴하기
                    </button>
                )}
            </aside>

            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-900 p-6 text-white shadow-xl">
                        <h2 className="text-lg font-bold">회원 탈퇴</h2>
                        <p className="mt-3 text-sm leading-6 text-zinc-300">
                            정말 탈퇴하시겠습니까?
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsWithdrawModalOpen(false)}
                                className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-700"
                            >
                                아니오
                            </button>
                            <button
                                type="button"
                                onClick={() => withdrawMutation.mutate()}
                                disabled={withdrawMutation.isPending}
                                className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                            >
                                {withdrawMutation.isPending ? "처리 중..." : "예"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
