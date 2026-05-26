import { clearCart } from "../features/cart/cartSlice";
import { closeModal } from "../features/modal/modalSlice";
import { useDispatch, useSelector } from "../hooks/useCustomRedux";

const Modal = () => {
    const isOpen = useSelector((state) => state.modal.isOpen);
    const dispatch = useDispatch();

    if (!isOpen) {
        return null;
    }

    const handleClearCart = () => {
        dispatch(clearCart());
        dispatch(closeModal());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.55)] px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-sm bg-white px-10 py-8 text-center shadow-xl">
                <p className="mb-6 text-base font-medium text-gray-900">정말 삭제하시겠습니까?</p>
                <div className="flex justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => dispatch(closeModal())}
                        className="rounded-sm bg-gray-200 px-5 py-1.5 text-sm font-medium text-gray-700"
                    >
                        아니요
                    </button>
                    <button
                        type="button"
                        onClick={handleClearCart}
                        className="rounded-sm bg-red-500 px-5 py-1.5 text-sm font-medium text-white"
                    >
                        네
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
