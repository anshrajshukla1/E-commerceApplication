import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../store/actions";
import { LuBadgeAlert } from "react-icons/lu";

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
    <div className="page-section py-12">
      
      <Filter categories={categories ? categories : []} />

      {isLoading ? (
        <Loader />
      ) : errorMessage ? (
        <div className="surface-card mx-auto flex h-50 max-w-xl items-center justify-center gap-3 px-6">
          <LuBadgeAlert className="text-3xl text-slate-800" />
          <span className="text-slate-800 text-lg font-medium">
            {errorMessage}
          </span>
        </div>
      ) : (
        <div className="min-h-[700px]">
          <div className="grid gap-6 pb-6 pt-10 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2">
            
            {products && products.length > 0 ? (
              products.map((item, i) => (
                <ProductCard key={i} {...item} />
              ))
            ) : (
              <p className="surface-card col-span-full py-12 text-center text-slate-600">
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
