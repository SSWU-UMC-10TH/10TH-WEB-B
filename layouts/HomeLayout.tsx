import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const HomeLayout = () => {

const navigate = useNavigate();
const [open, setOpen] = useState(false);
const sidebarRef = useRef<HTMLDivElement | null>(null);

const token = localStorage.getItem("accessToken");

useEffect(() => {
  const handler = (e: any) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setOpen(false);
    }
  };
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
    }, []);

  return (
  <div className="h-dvh flex flex-col">

    {/* 헤더 */}
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
      
      {/* 버거 버튼 */}
      <button onClick={() => setOpen(!open)}>
        <svg width="32" height="32" viewBox="0 0 48 48">
          <path d="M7.95 11.95h32m-32 12h32m-32 12h32"
            stroke="black" strokeWidth="4" />
        </svg>
      </button>

      {/* 로그인 상태 */}
      <div>
        {!token ? (
          <>
            <button onClick={() => navigate("/login")}>로그인</button>
            <button onClick={() => navigate("/signup")}>회원가입</button>
          </>
        ) : (
          <span>유저님 반갑습니다 👋</span>
        )}
      </div>
    </nav>

    {/* 사이드바 */}
    {open && (
      <div
        ref={sidebarRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "200px",
          height: "100%",
          background: "#fff",
          borderRight: "1px solid #ddd",
          padding: "20px"
        }}
      >
        사이드바
      </div>
    )}

    {/* 메인 */}
    <main className="flex-1">
      <Outlet />
    </main>

    <footer>푸터</footer>

    {/* 플로팅 버튼 */}
    <button
      onClick={() => navigate("/")}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#ff5a5f",
        color: "white",
        fontSize: "30px",
        border: "none",
        cursor: "pointer",
      }}
    >
      +
    </button>

  </div>
);
  
}
export default HomeLayout;