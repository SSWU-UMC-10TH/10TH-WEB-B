import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { openModal } from "../slices/modalSlice";

const PriceBox = () => {
    const {total} = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const handleInitializeCart = () => {
        dispatch(openModal());
    };
    
  return (
    <div className='p-12 relative'>
        <div className='flex justify-center'>
            <button className='border p-4 rounded-md cursor-pointer' onClick={handleInitializeCart}>
                전체 삭제
            </button>
        </div>
        <div className='absolute right-10 '>
            총 가격: {total}원
        </div>
    </div>
  )
}
export default PriceBox;