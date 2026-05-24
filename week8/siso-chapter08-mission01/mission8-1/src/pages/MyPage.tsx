import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response); //response.data
      setEditName(response?.data?.name || "");
      setEditBio(response?.data?.bio || "");
    };
    getData();
  }, []);

  const { mutate: updateProfile } = useMutation({
    mutationFn: (updateData: { name: string; bio: string }) => {
      // return patchUpdateProfile(updateData); // 실제 API 함수
      return fetch("/api/member/update", {
        method: "PATCH",
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: () => {
      alert("프로필이 수정되었습니다.");
      setIsEditing(false);
      // 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      window.location.reload(); // 혹은 다시 getMyInfo 호출
    },
  });

  const handleSave = () => {
    updateProfile({ name: editName, bio: editBio });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    /*
    <div>
      <h1>{data?.data?.name}님 환영합니다.</h1>
      <img src={data?.data?.avatar as string} alt={"구글로고"} />
      <h1>{data?.data?.email}</h1>
      <h1>{data?.data?.name}님 환영합니다.</h1>

      <button
        className="cursor-pointer bg-blue-300 rounded-sm p-5 hover:scale-90"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
    */
    <div className="bg-black flex flex-col items-center min-h-screen text-white p-8">
      <div className="flex items-center gap-8 max-w-2xl w-full mb-12">
        <div className="relative group cursor-pointer">
          <img
            src={
              (data?.data?.avatar as string) ||
              "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-zinc-800"
          />
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-xs">
              변경
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 gap-3">
          {isEditing ? (
            <>
              <div className="flex items-center gap-3">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-transparent border-2 border-blue-500 rounded-md px-3 py-1 text-2xl font-bold w-full outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSave}
                  className="text-white hover:text-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              </div>
              <input
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="bio를 입력하세요"
                className="bg-transparent border border-zinc-600 rounded-md px-3 py-1 text-sm w-full outline-none focus:border-white"
              />
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">
                  {data?.data?.name || "사용자"}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-zinc-500 hover:text-white transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              <p className="text-zinc-400 font-medium">
                {data?.data?.bio || "소개글이 없습니다."}
              </p>
            </>
          )}
          <p className="text-zinc-500 text-sm">{data?.data?.email}</p>
        </div>
      </div>

      <div className="w-full max-w-4xl border-t border-zinc-800">
        <div className="flex justify-center gap-12 py-4 text-sm font-bold">
          <button className="text-white border-b-2 border-white pb-2 px-2">
            내가 좋아요 한 LP
          </button>
          <button className="text-zinc-600 hover:text-zinc-400 pb-2 px-2">
            내가 작성한 LP
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="bg-black border border-zinc-700 px-4 py-1 rounded text-xs text-white">
            오래된순
          </button>
          <button className="bg-white border border-zinc-700 px-4 py-1 rounded text-xs text-black font-bold">
            최신순
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8"></div>
      </div>
    </div>
  );
};

export default MyPage;
