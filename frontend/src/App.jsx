import React, { useEffect } from "react";
import "./App.css";
import Products from "./components/products/Products";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Navbar from "./components/shared/navbar";
import About from "./components/About";
import Contact from "./components/Contact";
import { Toaster } from "react-hot-toast";
import Cart from "./components/cart/Cart";
import LogIn from "./components/auth/Login";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/auth/Register";
import Checkout from "./components/checkout/Checkout";
import { useDispatch, useSelector } from "react-redux";
import { getUserAddresses, getUserCart } from "./store/actions";
import PaymentConfirmation from "./components/checkout/PaymentConfirmation";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserCart());
      dispatch(getUserAddresses());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

              <Route path='/' element={<PrivateRoute />}>
            <Route path='/checkout' element={ <Checkout />}/>
            <Route path='/order-confirm' element={ <PaymentConfirmation />}/>
          </Route>

          <Route element={<PrivateRoute publicPage={true} />}>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </Router>

      <Toaster position="bottom-center" />
    </React.Fragment>
  );
}

export default App;
