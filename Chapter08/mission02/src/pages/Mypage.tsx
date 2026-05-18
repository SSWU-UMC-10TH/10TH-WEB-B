import { type FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyInfo, patchMyInfo, postLogout } from "../apis/auth";
import { useAuth } from "../context/auth";
import type { ResponseMyInfoDto } from "../types/auth";

const DEFAULT_PROFILE_IMAGE = "/default-profile.svg";

const Mypage = () => {
    const navigate = useNavigate();
    const { clearAuth, updateUserName, userName } = useAuth();
    const [data, setData] = useState<ResponseMyInfoDto>();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const logoutMutation = useMutation({
        mutationFn: postLogout,
        onSettled: () => {
            clearAuth();
            navigate("/login");
        },
    });

    const updateMyInfoMutation = useMutation({
        mutationFn: patchMyInfo,
        onMutate: (variables) => {
            const previousData = data;
            const previousUserName = userName ?? data?.data.name ?? null;
            const nextName = variables.name ?? data?.data.name;

            setData((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        name: variables.name ?? prev.data.name,
                        bio: variables.bio ?? prev.data.bio,
                    },
                };
            });

            if (nextName) {
                updateUserName(nextName);
            }

            setErrorMessage("");

            return { previousData, previousUserName };
        },
        onSuccess: (response) => {
            setData(response);
            updateUserName(response.data.name);
            setIsEditingProfile(false);
            setErrorMessage("");
        },
        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                setData(context.previousData);
            }

            if (context?.previousUserName) {
                updateUserName(context.previousUserName);
            }

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

    const handleToggleEditProfile = () => {
        if (!data) return;

        if (isEditingProfile) {
            setIsEditingProfile(false);
            setErrorMessage("");
            return;
        }

        setName(data.data.name ?? "");
        setBio(data.data.bio ?? "");
        setErrorMessage("");
        setIsEditingProfile(true);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextName = name.trim();
        if (!nextName) return;

        updateMyInfoMutation.mutate({
            name: nextName,
            bio: bio.trim(),
        });
    };

    const isSubmitting = updateMyInfoMutation.isPending;

    return (
        <div className="min-h-[calc(100dvh-4rem)] bg-black px-4 py-8 text-white">
            <div className="mx-auto w-full max-w-xl">
                <section className="relative border-b border-zinc-900 pb-4">
                    <button
                        type="button"
                        onClick={handleToggleEditProfile}
                        disabled={!data || isSubmitting}
                        className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 disabled:text-gray-300"
                        aria-label="프로필 수정"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path
                                d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path
                                d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1 0 2.8 2 2 0 0 1-2.8 0l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.3a2 2 0 0 1-4 0V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 0 1-2.8 0 2 2 0 0 1 0-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.5 7a2 2 0 0 1 0-2.8 2 2 0 0 1 2.8 0l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V2.7a2 2 0 0 1 4 0V3a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 0 1 2.8 0 2 2 0 0 1 0 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.3a2 2 0 0 1 0 4h-.3a1.7 1.7 0 0 0-1.6.9Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {isEditingProfile ? (
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center gap-4 pr-12 sm:gap-5"
                        >
                            <img
                                src={data?.data?.avatar || DEFAULT_PROFILE_IMAGE}
                                alt={data?.data?.name ?? "기본 프로필"}
                                className="h-24 w-24 shrink-0 rounded-full object-cover sm:h-28 sm:w-28"
                            />
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        className="h-8 min-w-0 flex-1 rounded border border-blue-500 bg-black px-3 text-sm font-semibold text-white outline-none focus:border-blue-400"
                                        aria-label="닉네임"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!name.trim() || isSubmitting}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center text-zinc-200 hover:text-white disabled:text-zinc-600"
                                        aria-label="프로필 저장"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="m5 12 4.2 4.2L19 6.8"
                                                stroke="currentColor"
                                                strokeWidth="2.2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={bio}
                                    onChange={(event) => setBio(event.target.value)}
                                    className="h-7 w-full rounded border border-zinc-500 bg-black px-3 text-xs text-zinc-200 outline-none focus:border-blue-400"
                                    aria-label="bio"
                                />
                                <p className="truncate text-xs font-semibold text-zinc-300">
                                    {data?.data?.email}
                                </p>
                            </div>
                        </form>
                    ) : (
                        <div className="flex items-center gap-4 pr-12 sm:gap-5">
                            <img
                                src={data?.data?.avatar || DEFAULT_PROFILE_IMAGE}
                                alt={data?.data?.name ?? "기본 프로필"}
                                className="h-24 w-24 shrink-0 rounded-full object-cover sm:h-28 sm:w-28"
                            />
                            <div className="min-w-0 flex-1 text-left">
                                <h1 className="truncate text-lg font-bold text-white">
                                    {data?.data?.name ?? "마이페이지"}
                                </h1>
                                <p className="mt-2 truncate text-sm text-zinc-300">
                                    {data?.data?.bio ?? "소개가 없습니다."}
                                </p>
                                <p className="mt-3 truncate text-xs font-semibold text-zinc-300">
                                    {data?.data?.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {errorMessage && <p className="mt-3 text-sm text-red-400">{errorMessage}</p>}
                </section>

                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="rounded-lg bg-red-500 px-6 py-2 font-bold text-white transition duration-200 hover:scale-105 hover:bg-red-600 disabled:bg-gray-300"
                    >
                        {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Mypage;
