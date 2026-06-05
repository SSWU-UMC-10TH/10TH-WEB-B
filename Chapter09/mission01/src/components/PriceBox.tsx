import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { openModal } from "../features/modal/modalSlice";

const PriceBox = () => {
    const { total } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const handleInitializeCart = () => {
        dispatch(openModal());
    };

    return (
        <div className="mx-auto w-full max-w-3xl px-4 pt-2 pb-12 flex flex-col items-center gap-6">
            <p className="self-end">총 가격 {total} 원</p>
            <button onClick={handleInitializeCart} className="border p-4 rounded-md cursor-pointer">
                전체 삭제
            </button>
        </div>
    );
};

export default PriceBox;
