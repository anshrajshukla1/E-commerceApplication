import { LuArrowLeft, LuShoppingCart } from "react-icons/lu";
import { Link } from "react-router-dom";

const CartEmpty = () => {
  return (
    <div className="page-section flex min-h-[800px] flex-col items-center justify-center py-12">
      <div className="surface-card flex w-full max-w-xl flex-col items-center px-8 py-14 text-center">
        <span className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <LuShoppingCart size={52} />
        </span>
        <div className="text-3xl font-bold text-slate-700">Your cart is empty</div>
        <div className="mt-2 text-lg text-slate-500">
          Add some products to get started
        </div>
        <Link to="/" className="btn-primary mt-8">
          <LuArrowLeft size={18} />
          <span>Start Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default CartEmpty;
