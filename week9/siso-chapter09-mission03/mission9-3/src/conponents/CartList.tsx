import CartItem from "./CartItem";
import { useCartInfo, useCartActions } from "../hooks/useCartStore";

const CartList = () => {
  const { cartItems } = useCartInfo();
  const { clearCart } = useCartActions();

  const handleAllClearButton = () => {
    clearCart();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} lp={item} />
        ))}
      </ul>
    </div>
  );
};

export default CartList;
