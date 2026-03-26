import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
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
    <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
      <div
        onClick={() => handleProductView(productData)}
        className="w-full overflow-hidden aspect-[3/2]"
      >
        <img
          className="w-full h-full cursor-pointer transition-transform duration-300 hover:scale-105"
          src={image}
          alt={productName}
        />
      </div>

      <div className="p-4">
        <h2
          onClick={() => handleProductView(productData)}
          className="text-lg font-semibold mb-2 cursor-pointer"
        >
          {truncateText(productName, 50)}
        </h2>

        <div className="min-h-20 max-h-20">
          <p className="text-gray-600 text-sm">
            {truncateText(description, 80)}
          </p>
        </div>

        {!about && (
          <div className="flex items-center justify-between mt-4">
            {specialPrice ? (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through">
                  ${Number(price).toFixed(2)}
                </span>
                <span className="text-xl font-bold text-slate-700">
                  ${Number(specialPrice).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold text-slate-700">
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
              className={`${isAvailable ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-100 text-gray-600 cursor-not-allowed"} py-2 px-3 rounded-lg items-center transition-colors duration-300 w-36 flex justify-center`}
            >
              <FaShoppingCart className="mr-2" />
              {isAvailable ? "Add to Cart" : "Stock Out"}
            </button>
          </div>
        )}
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
