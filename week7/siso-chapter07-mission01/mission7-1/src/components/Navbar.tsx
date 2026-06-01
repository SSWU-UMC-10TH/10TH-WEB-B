import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { accessToken } = useAuth();
  console.log(accessToken);

  return (
    <nav className="bg-[#161616] shadow-md fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
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
          <Link to="/" className="text-2xl font-bold text-[#ff007f]">
            돌려돌려LP판
          </Link>
        </div>
        <div className="space-x-6">
          <Link to={"/search"} className="text-white hover:text-[#ff007f]">
            검색
          </Link>
          {!accessToken && (
            <>
              <Link to={"/login"} className="text-white hover:text-[#ff007f]">
                로그인
              </Link>
              <Link to={"/signup"} className="text-white hover:text-[#ff007f]">
                회원가입
              </Link>
            </>
          )}
          {accessToken && (
            <Link to={"/my"} className="text-white hover:text-[#ff007f]">
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
