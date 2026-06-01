import "./App.css";
import CartList from "./conponents/CartList";
import Navbar from "./conponents/Navbar";
import PriceBox from "./conponents/PriceBox";
import Modal from "./conponents/Modal";
import { useCartInfo } from "./hooks/useCartStore";

function App() {
  const { isOpen } = useCartInfo();

  return (
    <>
      <Navbar />
      <CartList />
      <PriceBox />
      {isOpen && <Modal />}
    </>
  );
}

export default App;
