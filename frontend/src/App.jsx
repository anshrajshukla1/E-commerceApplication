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
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/dashboard/Dashboard";
import Sellers from "./components/admin/sellers/Sellers";
import Category from "./components/admin/categories/Category";
import AdminProducts from "./components/admin/products/AdminProducts";
import Orders from "./components/admin/orders/Orders";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token")?.trim();

    if (user?.id && token) {
      dispatch(getUserCart());
      dispatch(getUserAddresses());
    }
  }, [dispatch, user?.id]);

  return (
    <React.Fragment>
      <Router>
        <div className="app-shell">
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

            <Route element={<PrivateRoute adminOnly/>}>
              <Route path="/admin" element={<AdminLayout />} >
                  <Route path='' element={<Dashboard/>}/>
                   <Route path='products' element={<AdminProducts/>}/>
                    <Route path='sellers' element={<Sellers/>}/>
                    <Route path="orders" element={<Orders/>}/>
                     <Route path='categories' element={<Category/>}/>
              </Route>
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/cart" element={<Cart />} />
            </Route>
          </Routes>
        </div>
      </Router>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: "16px",
            background: "#111827",
            color: "#fff",
            boxShadow: "0 20px 45px -28px rgba(15, 23, 42, 0.55)",
          },
        }}
      />
    </React.Fragment>
  );
}

export default App;
