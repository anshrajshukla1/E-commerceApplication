import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../store/actions";
import { FaExclamationTriangle } from "react-icons/fa";

import Filter from "./Filter";
import useProductFilter from "../../hooks/useProductFilter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";
import ProductCard from "../shared/ProductCard";

const Products = () => {
  const { isLoading, errorMessage } = useSelector(
    (state) => state.errors
  );

  const { products, categories, pagination } = useSelector(
    (state) => state.products
  );

  const dispatch = useDispatch();

  // 🔥 custom hook (fetch products)
  useProductFilter();

  // 🔥 fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="lg:px-14 sm:px-8 py-14 2xl:w-[90%] 2xl:mx-auto">
      
      <Filter categories={categories ? categories : []} />

      {isLoading ? (
        <Loader />
      ) : errorMessage ? (
        <div className="flex justify-center items-center h-50">
          <FaExclamationTriangle className="text-slate-800 text-3xl mr-2" />
          <span className="text-slate-800 text-lg font-medium">
            {errorMessage}
          </span>
        </div>
      ) : (
        <div className="min-h-[700px]">
          <div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
            
            {products && products.length > 0 ? (
              products.map((item, i) => (
                <ProductCard key={i} {...item} />
              ))
            ) : (
              <p className="text-center col-span-full">
                No products found
              </p>
            )}

          </div>

          <div className="flex justify-center pt-10">
            <Paginations
              numberOfPage={pagination?.totalPages}
              totalProducts={pagination?.totalElements}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;