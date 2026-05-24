import { useState } from "react";
import { useAuth } from "../context/auth";
import CreateLpModal from "./CreateLpModal";

const FloatingCreateLpButton = () => {
    const { accessToken } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (!accessToken) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-3xl font-bold leading-none text-white shadow-lg transition hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300/40 md:bottom-8 md:right-8"
                aria-label="LP 작성하기"
            >
                +
            </button>
            <CreateLpModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
};

export default FloatingCreateLpButton;
