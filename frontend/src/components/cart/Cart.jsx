import { MdArrowBack, MdShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ItemContent from "./ItemContent";
import CartEmpty from "./CartEmpty";
import { formatPrice } from "../../utils/formatPrice";

const Cart = () => {

  const { cart } = useSelector((state) => state.carts);

  const totalPrice = cart?.reduce(
    (acc, cur) =>
      acc + Number(cur.specialPrice) * Number(cur.quantity),
    0
  );

  if (!cart || cart.length === 0) return <CartEmpty />;

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <MdShoppingCart size={36} />
          Your Cart
        </h1>
        <p className="text-gray-600">All your selected items</p>
      </div>

      <div className="grid md:grid-cols-5 grid-cols-4 gap-4 pb-2 font-semibold">
        <div className="md:col-span-2">Product</div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Total</div>
      </div>

      {cart.map((item) => (
        <ItemContent key={item.productId} {...item} />
      ))}

      <div className="border-t py-4 flex flex-col gap-4 items-end">
        <div className="flex justify-between w-full max-w-sm font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <Link to="/checkout">
          <button className="w-[300px] py-2 bg-blue-500 text-white flex items-center justify-center gap-2">
            <MdShoppingCart />
            Checkout
          </button>
        </Link>

        <Link to="/products" className="flex items-center gap-2 text-gray-500">
          <MdArrowBack />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;