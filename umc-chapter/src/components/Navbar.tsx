import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";

interface NavbarProps {
    onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
    const { accessToken, user, logout } = useAuth();
    const navigate = useNavigate();

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => navigate("/login"),
    });

    return (
        <nav className="bg-[#121212]/90 backdrop-blur-md border-b border-gray-800 fixed w-full z-40">
            <div className="flex items-center justify-between px-6 h-16">
                <div className="flex items-center gap-4">
                    <button onClick={onMenuClick} className="lg:hidden text-white cursor-pointer">
                        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.95 11.95h32m-32 12h32m-32 12h32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <Link to='/' className="text-2xl font-black text-[#FF1781] tracking-tighter">돌려돌려LP판</Link>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="text-white hover:text-[#FF1781]">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {!accessToken ? (
                        <div className="flex items-center space-x-4">
                            <Link to='/login' className="text-sm font-medium hover:text-[#FF1781]">로그인</Link>
                            <Link to='/signup' className="text-sm font-medium bg-[#FF1781] px-4 py-2 rounded-md hover:bg-[#e61574]">회원가입</Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm"><span className="font-bold">{user?.name}</span>님 반갑습니다.</span>
                            <button
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                                className="text-sm text-gray-400 hover:text-white underline underline-offset-4"
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;