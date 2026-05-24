import { type ChangeEvent, type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../apis/lp";
import { postImage } from "../apis/upload";
import { QUERY_KEY } from "../constants/key";

type CreateLpModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateLpModal = ({ isOpen, onClose }: CreateLpModalProps) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const previewUrlRef = useRef<string | null>(null);

    const resetForm = useCallback(() => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        setTitle("");
        setContent("");
        setTagInput("");
        setTags([]);
        setThumbnailFile(null);
        setThumbnailPreviewUrl("");
        setErrorMessage("");
    }, []);

    const handleClose = useCallback(() => {
        resetForm();
        onClose();
    }, [onClose, resetForm]);

    const createLpMutation = useMutation({
        mutationFn: postLp,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
            handleClose();
        },
        onError: () => {
            setErrorMessage("LP 작성에 실패했습니다. 입력값을 확인해주세요.");
        },
    });

    const uploadImageMutation = useMutation({
        mutationFn: postImage,
    });

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClose, isOpen]);

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    if (!isOpen) {
        return null;
    }

    const handleAddTag = () => {
        const nextTag = tagInput.trim();

        if (!nextTag || tags.includes(nextTag)) {
            setTagInput("");
            return;
        }

        setTags((prev) => [...prev, nextTag]);
        setTagInput("");
        setErrorMessage("");
    };

    const handleRemoveTag = (targetTag: string) => {
        setTags((prev) => prev.filter((tag) => tag !== targetTag));
    };

    const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        if (!file) {
            setThumbnailFile(null);
            setThumbnailPreviewUrl("");
            return;
        }

        const nextPreviewUrl = URL.createObjectURL(file);
        previewUrlRef.current = nextPreviewUrl;
        setThumbnailFile(file);
        setThumbnailPreviewUrl(nextPreviewUrl);
        setErrorMessage("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (tags.length === 0) {
            setErrorMessage("태그를 1개 이상 추가해주세요.");
            return;
        }

        try {
            const thumbnail = thumbnailFile
                ? (await uploadImageMutation.mutateAsync(thumbnailFile)).data.imageUrl
                : undefined;

            createLpMutation.mutate({
                title: title.trim(),
                content: content.trim(),
                tags,
                published: true,
                thumbnail,
            });
        } catch {
            setErrorMessage("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const isSubmitting = createLpMutation.isPending || uploadImageMutation.isPending;
    const canAddTag = tagInput.trim().length > 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
            onMouseDown={handleClose}
            role="presentation"
        >
            <form
                onSubmit={handleSubmit}
                onMouseDown={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-lg bg-zinc-800 p-6 text-white shadow-2xl"
                aria-label="LP 작성 모달"
            >
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </div>

                {thumbnailPreviewUrl ? (
                    <img
                        src={thumbnailPreviewUrl}
                        alt="LP 미리보기"
                        className="mx-auto mb-8 h-36 w-36 rounded-full object-cover shadow-2xl"
                    />
                ) : (
                    <div className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,#f8fafc_0_8%,#d1d5db_9%_17%,#020617_18%_36%,#111827_37%_46%,#020617_47%_61%,#1f2937_62%_68%,#020617_69%)] shadow-2xl">
                        <div className="h-3 w-3 rounded-full bg-zinc-400" />
                    </div>
                )}

                <div className="space-y-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="w-full cursor-pointer rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-pink-500 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-pink-600 focus:border-pink-400 focus:outline-none"
                    />

                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="LP Name"
                        className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-pink-400 focus:outline-none"
                    />

                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="LP Content"
                        rows={3}
                        className="w-full resize-none rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-pink-400 focus:outline-none"
                    />

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(event) => setTagInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleAddTag();
                                }
                            }}
                            placeholder="LP Tag"
                            className="min-w-0 flex-1 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-pink-400 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            disabled={!canAddTag}
                            className="rounded-md bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:bg-zinc-600 disabled:text-zinc-400"
                        >
                            태그 추가
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2" aria-live="polite">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 rounded bg-zinc-700 px-2 py-1 text-xs font-semibold text-zinc-200"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="flex h-4 w-4 items-center justify-center rounded-full text-zinc-300 hover:bg-zinc-600 hover:text-white"
                                        aria-label={`${tag} 태그 삭제`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}

                    <button
                        type="submit"
                        className="w-full rounded-md bg-slate-400 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-300 disabled:bg-zinc-600 disabled:text-zinc-400"
                        disabled={!title.trim() || !content.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add LP"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLpModal;
