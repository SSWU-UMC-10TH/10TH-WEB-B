import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { postLp } from "../apis/lp"; // 실제 API 함수 임포트 필요

interface AddLpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddLpModal = ({ isOpen, onClose }: AddLpModalProps) => {
  const queryClient = useQueryClient();

  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: (newLP: any) => {
      return fetch("/api/lps", { method: "POST", body: JSON.stringify(newLP) });
    },
    onSuccess: () => {
      alert("LP 등록 성공!");
      queryClient.invalidateQueries({ queryKey: ["lps"] }); // 메인 목록 새로고침
      handleClose();
    },
  });

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (target: string) => {
    setTags(tags.filter((tag) => tag !== target));
  };

  const handleClose = () => {
    setLpName("");
    setLpContent("");
    setTags([]);
    setTagInput("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#2c2c2e] w-full max-w-md rounded-2xl p-6 relative flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={handleClose}
        >
          ✕
        </button>

        <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center border-2 border-zinc-700">
          <label className="cursor-pointer flex flex-col items-center">
            <span className="text-xs text-gray-500">사진 선택</span>
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            value={lpName}
            onChange={(e) => setLpName(e.target.value)}
            type="text"
            placeholder="LP Name"
            className="w-full bg-[#1c1c1e] border border-zinc-800 p-3 rounded-lg text-white"
          />
          <input
            value={lpContent}
            onChange={(e) => setLpContent(e.target.value)}
            type="text"
            placeholder="LP Content"
            className="w-full bg-[#1c1c1e] border border-zinc-800 p-3 rounded-lg text-white"
          />

          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              type="text"
              placeholder="LP Tag"
              className="flex-1 bg-[#1c1c1e] border border-zinc-800 p-3 rounded-lg text-white"
            />
            <button
              onClick={handleAddTag}
              className="bg-zinc-700 px-4 rounded-lg text-white"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 bg-[#1c1c1e] border border-zinc-700 px-3 py-1 rounded-md text-sm text-white"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => mutate({ title: lpName, content: lpContent, tags })}
          disabled={isPending}
          className="w-full bg-[#ff007f] py-3 rounded-lg font-bold text-white disabled:bg-gray-600"
        >
          {isPending ? "Adding..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};

export default AddLpModal;
