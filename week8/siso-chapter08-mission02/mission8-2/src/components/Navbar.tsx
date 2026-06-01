import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { accessToken, logout, userName } = useAuth();
  console.log(accessToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <nav className="bg-[#161616] shadow-md fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-zinc-800 rounded-md transition-colors"
          >
            <svg
              className="cursor-pointer text-white"
              width="32"
              height="32"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
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
          <Link to="/" className="text-2xl font-bold text-[#ff007f]">
            돌려돌려LP판
          </Link>
        </div>
        <div className="flex items-center gap-6 text-white text-sm">
          <Link to="/search" className="hover:text-[#ff007f]">
            🔍
          </Link>

          {accessToken ? (
            <>
              <span>{userName}님 반갑습니다.</span>
              <button
                onClick={handleLogout}
                className="hover:text-[#ff007f] cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-[#ff007f]">
                로그인
              </Link>
              <Link to="/signup" className="hover:text-[#ff007f]">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
