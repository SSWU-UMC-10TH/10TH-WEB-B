import { Link } from "react-router-dom";

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
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
                <button
                    type="button"
                    className="absolute bottom-0 px-6 py-8 text-left text-sm font-semibold text-zinc-300 hover:text-pink-400"
                >
                    탈퇴하기
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
