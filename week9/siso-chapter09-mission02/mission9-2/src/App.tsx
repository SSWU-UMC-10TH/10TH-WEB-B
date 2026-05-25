import { Provider } from "react-redux";
import "./App.css";
import CartList from "./conponents/CartList";
import Navbar from "./conponents/Navbar";
import store from "./store/store";
import PriceBox from "./conponents/PriceBox";
import Modal from "./conponents/Modal";
import { useSelector } from "./hooks/useCustomRedux";

function AppContent() {
  const { isOpen } = useSelector((state) => state.modal);

  return (
    <>
      <Navbar />
      <CartList />
      <PriceBox />
      {isOpen && <Modal />}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      {/*<Navbar />*/}
      {/*<CartList />*/}
      {/*<PriceBox />*/}
      <AppContent />
    </Provider>
  );
}

export default App;
