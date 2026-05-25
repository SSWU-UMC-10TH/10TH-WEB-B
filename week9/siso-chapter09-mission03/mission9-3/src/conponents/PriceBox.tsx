import { useCartActions, useCartInfo } from "../hooks/useCartStore";

const PriceBox = () => {
  const { total } = useCartInfo();
  const { openModal } = useCartActions();

  return (
    <div className="p-12 flex justify-end">
      <button
        onClick={openModal}
        className="border p-4 rounded-md cursor-pointer"
      >
        장바구니 초기화
      </button>
      <div>총 가격: {total}</div>
    </div>
  );
};

export default PriceBox;
