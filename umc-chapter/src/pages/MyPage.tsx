import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { getMe, patchMe } from "../apis/user";
import { useAuth } from "../contexts/AuthContext";
import type { GetMeResponse } from "../apis/user";

const MyPage = () => {
    const { user } = useAuth();
    const [data, setData] = useState<GetMeResponse | null>(null);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getMe().then((res) => {
            setData(res);
            setName(res.name);
            setBio(res.bio ?? "");
        });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);
        if (f) setPreviewUrl(URL.createObjectURL(f));
    };

    const updateMutation = useMutation({
        mutationFn: () => patchMe({ id: user!.id, name, bio }),
        onSuccess: async () => {
            const updated = await getMe();
            setData(updated);
            setName(updated.name);
            setBio(updated.bio ?? "");
            setFile(null);
            setPreviewUrl(null);
            setEditing(false);
        },
        onError: () => {
            alert("저장에 실패했습니다. 다시 시도해주세요.");
        },
    });

    const profileSrc = previewUrl ?? data?.profileImageUrl ?? "https://via.placeholder.com/100/333/fff?text=?";

    return (
        <div className="max-w-lg mx-auto px-4 py-8 text-white">
            <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                    <img
                        src={profileSrc}
                        alt="프로필"
                        className="w-24 h-24 rounded-full object-cover bg-gray-700"
                    />
                    {editing && (
                        <>
                            <label
                                htmlFor="profile-image"
                                className="absolute bottom-0 right-0 bg-[#FF1781] rounded-full p-1 text-xs cursor-pointer"
                            >
                                📷
                            </label>
                            <input
                                id="profile-image"
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </div>

                <div className="flex-1">
                    {editing ? (
                        <div className="flex flex-col gap-2">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm w-full"
                                placeholder="이름"
                            />
                            <input
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm w-full"
                                placeholder="bio (선택)"
                            />
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-xl font-bold">{data?.name}</h1>
                            {/* bio가 빈 문자열이 아닐 때만 표시 */}
                            {data?.bio && data.bio.trim() !== "" && (
                                <p className="text-gray-400 text-sm mt-1">{data.bio}</p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">{data?.email}</p>
                        </div>
                    )}
                </div>

                {editing ? (
                    <button
                        onClick={() => updateMutation.mutate()}
                        disabled={updateMutation.isPending}
                        className="text-[#FF1781] text-xl disabled:opacity-50"
                    >
                        ✓
                    </button>
                ) : (
                    <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-white text-xl">⚙</button>
                )}
            </div>
        </div>
    );
};

export default MyPage;