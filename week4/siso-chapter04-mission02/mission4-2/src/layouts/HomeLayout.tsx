import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-900">
        <div className="text-[#ff007a] font-black text-xl tracking-tighter">
          돌려돌려LP판
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm font-bold hover:text-gray-300 cursor-pointer">
            로그인
          </button>
          <button className="bg-[#ff007a] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#d10064] cursor-pointer">
            회원가입
          </button>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
      <footer>푸터</footer>
    </div>
  );
};

export default HomeLayout;
