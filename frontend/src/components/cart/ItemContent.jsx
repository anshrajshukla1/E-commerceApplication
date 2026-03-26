import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
} from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";
import truncateText from "../../utils/truncateText";

const ItemContent = (props) => {
  const dispatch = useDispatch();
  const qty = Number(props.quantity) || 0;

  return (
    <div className="grid md:grid-cols-5 grid-cols-4 gap-4 items-center border border-slate-200 rounded-md px-4 py-4 mb-3">
      <div className="md:col-span-2 flex flex-col items-start gap-2">
        <h3 className="text-sm md:text-base font-semibold text-slate-700">
          {truncateText(props.productName)}
        </h3>

        <img
          src={
            props.image?.startsWith("http")
              ? props.image
              : `${import.meta.env.VITE_BACK_END_URL}/images/${props.image}`
          }
          alt={props.productName}
          className="w-24 h-24 object-cover rounded-md"
        />

        <button
          onClick={() => dispatch(removeFromCart(props, toast))}
          className="flex items-center gap-1 text-red-500 border border-red-400 px-3 py-1 rounded-md text-xs hover:bg-red-50 transition"
        >
          Remove
        </button>
      </div>

      <div className="justify-self-center text-sm md:text-base text-slate-700 font-medium">
        {formatPrice(props.specialPrice)}
      </div>

      <div className="justify-self-center flex items-center gap-2">
        <button
          disabled={qty <= 1}
          onClick={() => dispatch(decreaseCartQuantity(props, toast))}
          className="border px-2 py-1 text-sm"
        >
          -
        </button>

        <span className="text-sm">{qty}</span>

        <button
          onClick={() => dispatch(increaseCartQuantity(props, toast))}
          className="border px-2 py-1 text-sm"
        >
          +
        </button>
      </div>

      <div className="justify-self-center text-sm md:text-base text-slate-700 font-medium">
        {formatPrice(qty * props.specialPrice)}
      </div>
    </div>
  );
};

export default ItemContent;
