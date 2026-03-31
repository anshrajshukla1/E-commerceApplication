import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
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
    <div className="surface-card mb-4 grid grid-cols-4 items-center gap-4 px-4 py-5 md:grid-cols-5">
      <div className="md:col-span-2 flex flex-col items-start gap-2">
        <h3 className="text-sm font-semibold text-slate-700 md:text-base">
          {truncateText(props.productName)}
        </h3>

        <img
          src={
            props.image?.startsWith("http")
              ? props.image
              : `${import.meta.env.VITE_BACK_END_URL}/images/${props.image}`
          }
          alt={props.productName}
          className="h-24 w-24 rounded-2xl object-cover"
        />

        <button
          onClick={() => dispatch(removeFromCart(props, toast))}
          className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LuTrash2 />
          Remove
        </button>
      </div>

      <div className="justify-self-center text-sm font-medium text-slate-700 md:text-base">
        {formatPrice(props.specialPrice)}
      </div>

      <div className="justify-self-center flex items-center gap-2">
        <button
          disabled={qty <= 1}
          onClick={() => dispatch(decreaseCartQuantity(props, toast))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
        >
          <LuMinus />
        </button>

        <span className="min-w-8 text-center text-sm font-semibold">{qty}</span>

        <button
          onClick={() => dispatch(increaseCartQuantity(props, toast))}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm shadow-sm"
        >
          <LuPlus />
        </button>
      </div>

      <div className="justify-self-center text-sm font-medium text-slate-700 md:text-base">
        {formatPrice(qty * props.specialPrice)}
      </div>
    </div>
  );
};

export default ItemContent;
