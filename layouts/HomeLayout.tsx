import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex-col">
        <nav>네비게이션 바입니다.</nav>
        <main className="flex-1">
            <Outlet />
        </main>
            
        <footer>푸터</footer>
        {/* 플로팅 버튼 */}
      <button
        onClick={() => navigate("/lp/new")} // 이동 경로
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
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        +
      </button>
    </div>
    );
  
}
export default HomeLayout;