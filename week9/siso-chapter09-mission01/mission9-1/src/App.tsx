import { Provider } from "react-redux";
import "./App.css";
import CartList from "./conponents/CartList";
import Navbar from "./conponents/Navbar";
import store from "./store/store";
import PriceBox from "./conponents/PriceBox";

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <CartList />
      <PriceBox />
    </Provider>
  );
}

export default App;
