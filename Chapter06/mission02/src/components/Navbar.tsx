import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

type NavbarProps = {
    onToggleSidebar?: () => void;
};

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const { accessToken, userName } = useAuth();

    return (
        <nav className="fixed z-20 w-full bg-white shadow-md dark:bg-gray-900">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="flex h-10 w-10 items-center justify-center text-gray-900 hover:text-blue-500 md:hidden dark:text-gray-300"
                        aria-label="사이드바 열기"
                    >
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="4"
                                d="M7.95 11.95h32m-32 12h32m-32 12h32"
                            />
                        </svg>
                    </button>

                    <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
                        돌려돌려LP
                    </Link>
                </div>

                <div className="space-x-4 text-sm sm:space-x-6 sm:text-base">
                    {!accessToken ? (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-blue-500 dark:text-gray-300"
                            >
                                로그인
                            </Link>
                            <Link
                                to="/signup"
                                className="text-gray-700 hover:text-blue-500 dark:text-gray-300"
                            >
                                회원가입
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="hidden text-gray-700 sm:inline dark:text-gray-300">
                                {userName ?? "회원"}님 반갑습니다.
                            </span>
                            <Link
                                to="/my"
                                className="text-gray-700 hover:text-blue-500 dark:text-gray-300"
                            >
                                마이페이지
                            </Link>
                            <Link
                                to="/search"
                                className="text-gray-700 hover:text-blue-500 dark:text-gray-300"
                            >
                                검색
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
