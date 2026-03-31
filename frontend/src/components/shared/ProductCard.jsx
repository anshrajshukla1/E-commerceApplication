import { useState } from "react";
import { LuArrowRight, LuShoppingCart } from "react-icons/lu";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../../utils/truncateText";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";

const ProductCard = ({
  productId,
  productName,
  image,
  description,
  quantity,
  price,
  discount,
  specialPrice,
  about,
}) => {
  const [openProductViewModal, setOpenProductViewModal] = useState(false);
  const [selectedViewProduct, setSelectedViewProduct] = useState(null);

  const btnLoader = false;
  const isAvailable = quantity && Number(quantity) > 0;
  const dispatch = useDispatch();

  const productData = {
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
  };

  const handleProductView = (product) => {
    if (!about) {
      setSelectedViewProduct(product);
      setOpenProductViewModal(true);
    }
  };

  return (
    <div className="surface-card surface-card-hover group overflow-hidden">
      <div
        onClick={() => handleProductView(productData)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100"
      >
        <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm">
            {isAvailable ? "In Stock" : "Sold Out"}
          </span>
          {specialPrice ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {discount}% OFF
            </span>
          ) : null}
        </div>
        <img
          className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-110"
          src={image}
          alt={productName}
        />
      </div>

      <div className="space-y-4 p-5">
        <h2
          onClick={() => handleProductView(productData)}
          className="cursor-pointer text-lg font-semibold leading-7 text-slate-900 transition-colors group-hover:text-indigo-600"
        >
          {truncateText(productName, 50)}
        </h2>

        <div className="min-h-20 max-h-20">
          <p className="text-sm leading-6 text-slate-500">
            {truncateText(description, 80)}
          </p>
        </div>

        {!about && (
          <div className="flex items-end justify-between gap-4">
            {specialPrice ? (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-400 line-through">
                  ${Number(price).toFixed(2)}
                </span>
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  ${Number(specialPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                ${Number(price).toFixed(2)}
              </span>
            )}

            <button
              type="button"
              disabled={!isAvailable || btnLoader}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(addToCart(productData, 1, toast));
              }}
              className={`${isAvailable ? "btn-primary" : "cursor-not-allowed rounded-2xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-500"} inline-flex w-auto min-w-[132px] shrink-0 items-center justify-center gap-2 px-3 py-2.5 text-sm`}
            >
              <LuShoppingCart />
              {isAvailable ? "Add to Cart" : "Stock Out"}
            </button>
          </div>
        )}

        {about ? (
          <button
            type="button"
            onClick={() => handleProductView(productData)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Explore product
            <LuArrowRight />
          </button>
        ) : null}
      </div>

      <ProductViewModal
        open={openProductViewModal}
        setOpen={setOpenProductViewModal}
        product={selectedViewProduct}
        isAvailable={isAvailable}
      />
    </div>
  );
};

export default ProductCard;
