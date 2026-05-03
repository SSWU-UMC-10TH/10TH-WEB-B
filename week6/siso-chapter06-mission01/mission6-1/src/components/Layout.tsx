import React from "react";

const Layout = ({}) => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="w-64 bg-[#121212] border-r border-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-pink-500 mb-10">DOLIGO</h2>
          <nav className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer hover:text-pink-400">
              <span>🔍</span> 찾기
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-pink-400">
              <span>👤</span> 마이페이지
            </div>
          </nav>
        </div>

        <div className="text-sm text-gray-500 cursor-pointer hover:underline">
          탈퇴하기
        </div>
      </aside>
    </div>
  );
};

export default Layout;
