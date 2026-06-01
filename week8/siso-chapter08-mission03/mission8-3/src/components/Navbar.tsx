import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HamburgerButton } from "./HamburgerButton";
import { useSidebar } from "../hooks/useSidebar";

interface NavbarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar = ({ isOpen, toggleSidebar }: NavbarProps) => {
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
          <HamburgerButton isOpen={isOpen} onClick={toggleSidebar} />

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
