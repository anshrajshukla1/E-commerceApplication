import { LuArrowLeft, LuShoppingCart } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItemContent from "./ItemContent";
import CartEmpty from "./CartEmpty";
import { formatPrice } from "../../utils/formatPrice";

const Cart = () => {
  const { cart } = useSelector((state) => state.carts);

  const totalPrice = cart?.reduce(
    (acc, cur) => acc + Number(cur.specialPrice) * Number(cur.quantity),
    0
  );

  if (!cart || cart.length === 0) return <CartEmpty />;

  return (
    <div className="page-section py-10">
      <div className="mb-12 flex flex-col items-center">
        <h1 className="section-heading flex items-center gap-3 !text-[2.5rem]">
          <LuShoppingCart size={36} />
          Your Cart
        </h1>
        <p className="section-subtext">All your selected items</p>
      </div>

      <div className="surface-card mb-6 grid grid-cols-4 gap-4 px-4 py-4 font-semibold text-slate-700 md:grid-cols-5">
        <div className="md:col-span-2">Product</div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Total</div>
      </div>

      {cart.map((item) => (
        <ItemContent key={item.productId} {...item} />
      ))}

      <div className="surface-card mt-6 flex flex-col items-end gap-4 px-6 py-6">
        <div className="flex w-full max-w-sm justify-between font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <Link to="/checkout">
          <button className="btn-primary w-[300px]">
            <LuShoppingCart />
            Checkout
          </button>
        </Link>

        <Link
          to="/products"
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <LuArrowLeft />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
