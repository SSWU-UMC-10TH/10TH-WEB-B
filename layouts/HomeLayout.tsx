import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex-col">
        <nav>네비게이션 바입니다.</nav>
        <main className="flex-1">홈페이지</main>
            <Outlet />
        <footer>푸터</footer>
    </div>
    );
  
}
export default HomeLayout;