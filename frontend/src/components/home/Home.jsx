import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuBadgeAlert, LuSparkles } from "react-icons/lu";

import HeroBanner from "./HeroBanner";
import ProductCard from "../shared/ProductCard";
import { fetchProducts } from "../../store/actions";
import Loader from "../shared/Loader";

const Home = () => {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="page-section px-0 py-8">
      <div className="py-6">
        <HeroBanner />
      </div>

      <div className="py-8">
        <div className="mb-10 flex flex-col items-center justify-center space-y-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
            <LuSparkles />
            Featured collection
          </span>
          <h1 className="section-heading">Products</h1>
          <span className="section-subtext max-w-2xl">
            Discover Our Handpicked Selections of top-rated items just for you.
          </span>
        </div>

        {isLoading ? (
          <Loader />
        ) : errorMessage ? (
          <div className="surface-card mx-auto flex h-50 max-w-xl items-center justify-center gap-3 px-6">
            <LuBadgeAlert className="text-3xl text-slate-800" />
            <span className="text-lg font-medium text-slate-800">
              {errorMessage}
            </span>
          </div>
        ) : (
          <div className="grid gap-6 pb-6 pt-6 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2">
            {loading ? (
              <p className="col-span-full text-center">Loading...</p>
            ) : products && products.length > 0 ? (
              products.slice(0, 8).map((item, i) => (
                <ProductCard key={i} {...item} />
              ))
            ) : (
              <p className="surface-card col-span-full py-12 text-center text-slate-600">
                No products found
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
