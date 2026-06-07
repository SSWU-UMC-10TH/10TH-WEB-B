import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";

const Modal = () => {
    const { isOpen } = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    if (!isOpen) return null;

    const handleNo = () => {
        dispatch(closeModal());
    };

    const handleYes = () => {
        dispatch(clearCart());
        dispatch(closeModal());
    };

    return (
        <div
            className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleNo}
        >
            <div
                className="bg-white rounded-lg p-8 flex flex-col items-center gap-6 min-w-[260px]"
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-lg font-medium">정말 삭제하시겠습니까?</p>
                <div className="flex gap-4">
                    <button
                        className="px-6 py-2 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-100"
                        onClick={handleNo}
                    >
                        아니요
                    </button>
                    <button
                        className="px-6 py-2 rounded-md bg-red-500 text-white cursor-pointer hover:bg-red-600"
                        onClick={handleYes}
                    >
                        네
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;