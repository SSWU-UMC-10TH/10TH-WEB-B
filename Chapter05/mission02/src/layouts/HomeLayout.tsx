import { Link, Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            <nav className="border-b border-[#272727] bg-[#161616]">
                <div className="mx-auto flex h-[60px] max-w-screen-2xl items-center justify-between px-6">
                    <Link
                        to="/"
                        className="text-[18px] font-extrabold tracking-tight text-[#d946b6]"
                    >
                        돌려돌려LP판
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="rounded bg-black px-3 py-1 text-sm font-semibold text-white"
                        >
                            로그인
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded bg-[#d946b6] px-3 py-1 text-sm font-semibold text-white"
                        >
                            회원가입
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-[#d9d9d9]" />
        </div>
    );
};

export default HomeLayout;
