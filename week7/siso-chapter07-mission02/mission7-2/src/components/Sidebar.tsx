import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import ConfirmModal from "./ConfirmModal";
// import { deleteUser } from "../apis/auth"; // 실제 탈퇴 API 함수

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: withdrawMember } = useMutation({
    mutationFn: () => {
      return fetch("/api/auth/withdraw", { method: "DELETE" });
    },
    onSuccess: () => {
      alert("탈퇴가 완료되었습니다.");
      logout();
      navigate("/login");
    },
    onError: (error) => {
      console.error("탈퇴 실패:", error);
      alert("탈퇴 처리 중 오류가 발생했습니다.");
    },
  });

  return (
    <>
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-[#161616] text-white transition-all duration-300 ease-in-out z-20 ${
          isOpen ? "w-64" : "w-0 overflow-hidden"
        } border-r border-gray-800 flex flex-col justify-between`}
      >
        <div className="p-6 flex flex-col gap-6">
          <Link
            to="/search"
            className="flex items-center gap-3 hover:text-[#ff007f] transition"
          >
            <span>🔍</span> 검색
          </Link>
          {accessToken && (
            <Link
              to="/my"
              className="flex items-center gap-3 hover:text-[#ff007f] transition"
            >
              <span>👤</span> 마이페이지
            </Link>
          )}
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            className="text-gray-500 hover:text-red-500 text-sm transition"
            onClick={() => setIsModalOpen(true)}
          >
            탈퇴하기
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => withdrawMember()}
        message="정말 탈퇴하시겠습니까?"
      />
    </>
  );
};

export default Sidebar;
