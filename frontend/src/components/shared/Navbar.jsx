import { Badge } from "@mui/material";
import { useState } from "react";
import { LuLogIn, LuMenu, LuShoppingCart, LuSparkles, LuStore, LuX } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserMenu from "../UserMenu";

const Navbar = () => {
  const path = useLocation().pathname;
  const [navbarOpen,setNavbarOpen]= useState(false);
  const {cart } = useSelector((state)=>state.carts);
  
  const {user} = useSelector((state)=>state.auth);

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 text-slate-900 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="flex shrink-0 items-center gap-3 text-xl font-extrabold tracking-tight">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-500 text-white shadow-[0_14px_30px_-18px_rgba(99,102,241,0.95)]">
            <LuStore className="text-2xl" />
          </span>
          <span className="flex items-center gap-2">
            Ansh-verse
            <span className="hidden rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600 sm:inline-flex">
              Premium
            </span>
          </span>
        </Link>

        <ul className={`absolute left-0 top-16 flex w-full flex-col gap-4 border-b border-slate-200 bg-white/95 px-6 py-0 text-slate-700 shadow-xl backdrop-blur-xl transition-all duration-200 sm:static sm:ml-auto sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-2 sm:border-none sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:backdrop-blur-none lg:gap-3 ${
            navbarOpen ? "max-h-[420px] py-6" : "max-h-0 overflow-hidden sm:max-h-none"
          }`}>
          
          <li>
            <Link
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                path === "/" ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-100 hover:text-slate-900"
              }`}
              to="/"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                path === "/products" ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-100 hover:text-slate-900"
              }`}
              to="/products"
            >
              Products
            </Link>
          </li>

          <li>
            <Link
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                path === "/about" ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-100 hover:text-slate-900"
              }`}
              to="/about"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                path === "/contact" ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-100 hover:text-slate-900"
              }`}
              to="/contact"
            >
              Contact
            </Link>
          </li>

          {/* CART */}
          <li>
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.4)] transition hover:border-indigo-200 hover:text-indigo-600"
            >
              <Badge
                showZero
                badgeContent={cart?.length | 0}
                color="primary"
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <LuShoppingCart size={20} />
              </Badge>
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </li>

          {/* LOGIN BUTTON */}
          {(user && user.id) ? (
                    <li className="font-medium transition-all duration-150">
                        <UserMenu/>
                    </li>
                ) : (
                <li className="font-medium transition-all duration-150">
                   <Link className="btn-primary px-5 py-3 text-sm"
                    to="/login">
                        <LuLogIn />
                        <span>Login</span>
                        <LuSparkles className="text-base" />
                   </Link> 
                </li>
                )}
        </ul>
        <button onClick={()=> setNavbarOpen(!navbarOpen)}className="flex items-center rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-800 shadow-[0_16px_28px_-24px_rgba(15,23,42,0.45)] sm:hidden">
            {navbarOpen?(
               <LuX className="text-2xl" />
            ):(
                         <LuMenu className="text-2xl"/> 
            )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
