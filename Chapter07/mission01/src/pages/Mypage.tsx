import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getMyInfo, patchMyInfo, postLogout } from "../apis/auth";
import { postImage } from "../apis/upload";
import type { ResponseMyInfoDto } from "../types/auth";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE = "/default-profile.svg";

const Mypage = () => {
    const navigate = useNavigate();
    const { clearAuth, updateUserName } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const logoutMutation = useMutation({
        mutationFn: postLogout,
        onSettled: () => {
            clearAuth();
            navigate("/login");
        },
    });

    const uploadImageMutation = useMutation({
        mutationFn: postImage,
    });

    const updateMyInfoMutation = useMutation({
        mutationFn: patchMyInfo,
        onSuccess: (response) => {
            setData(response);
            updateUserName(response.data.name);
            setIsEditModalOpen(false);
            setAvatarFile(null);
            setErrorMessage("");
        },
        onError: () => {
            setErrorMessage("프로필 수정에 실패했습니다.");
        },
    });

    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();
            setData(response);
        };

        void getData();
    }, []);

    const handleOpenEditModal = () => {
        setName(data?.data.name ?? "");
        setBio(data?.data.bio ?? "");
        setAvatar(data?.data.avatar ?? "");
        setAvatarFile(null);
        setErrorMessage("");
        setIsEditModalOpen(true);
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setAvatarFile(file);

        if (file) {
            setAvatar(URL.createObjectURL(file));
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatar("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const nextAvatar = avatarFile
                ? (await uploadImageMutation.mutateAsync(avatarFile)).data.imageUrl
                : avatar;

            updateMyInfoMutation.mutate({
                name: name.trim(),
                bio: bio.trim(),
                avatar: nextAvatar,
            });
        } catch {
            setErrorMessage("프로필 사진 업로드에 실패했습니다.");
        }
    };

    const isSubmitting = uploadImageMutation.isPending || updateMyInfoMutation.isPending;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <div className="w-10" />
                    <h1 className="text-2xl font-semibold">{data?.data?.name}님 환영합니다</h1>
                    <button
                        type="button"
                        onClick={handleOpenEditModal}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-gray-600 hover:bg-gray-100"
                        aria-label="프로필 설정"
                    >
                        …
                    </button>
                </div>
                <img
                    src={data?.data?.avatar || DEFAULT_PROFILE_IMAGE}
                    alt={data?.data?.name ?? "기본 프로필"}
                    className="mx-auto mb-4 h-24 w-24 rounded-full object-cover shadow"
                />
                <p className="mb-2 text-sm text-gray-500">{data?.data?.bio ?? "소개가 없습니다."}</p>
                <h2 className="mb-6 text-lg text-gray-700">{data?.data?.email}</h2>
                <button
                    type="button"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="rounded-lg bg-red-500 px-6 py-2 font-bold text-white transition duration-200 hover:scale-105 hover:bg-red-600 disabled:bg-gray-300"
                >
                    {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                </button>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md rounded-lg bg-zinc-900 p-6 text-white shadow-xl"
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold">프로필 수정</h2>
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-zinc-300 hover:bg-zinc-800"
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </div>

                        <img
                            src={avatar || DEFAULT_PROFILE_IMAGE}
                            alt="프로필 미리보기"
                            className="mx-auto mb-5 h-24 w-24 rounded-full object-cover"
                        />

                        <div className="space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="w-full cursor-pointer rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-pink-500 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-pink-600 focus:border-pink-400 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveAvatar}
                                className="w-full rounded-md border border-zinc-600 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
                            >
                                프로필 사진 비우기
                            </button>
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="이름"
                                className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-pink-400 focus:outline-none"
                            />
                            <textarea
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                                rows={4}
                                placeholder="bio"
                                className="w-full resize-none rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-pink-400 focus:outline-none"
                            />

                            {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}

                            <button
                                type="submit"
                                disabled={!name.trim() || isSubmitting}
                                className="w-full rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                            >
                                {isSubmitting ? "수정 중..." : "수정 완료"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Mypage;
