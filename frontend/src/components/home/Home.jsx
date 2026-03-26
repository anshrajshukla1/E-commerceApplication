import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import HeroBanner from "./HeroBanner";
import ProductCard from "../shared/ProductCard";
import { fetchProducts } from "../../store/actions";
import Loader from "../shared/Loader";
import { FaExclamationTriangle } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);

  // ✅ THIS WAS MISSING
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { isLoading, errorMessage } = useSelector(
    (state) => state.errors
  );


  return (
    <div className="lg:px-14 sm:px-8 px-4">
        <div className="py-6">
          <HeroBanner />
        </div>
      
         <div className="py-5">
             <div className="flex flex-col justify-center items-center space-y-2">
                <h1 className="text-slate-800 text-4xl font-bold">Products</h1>
                     <span className="text-slate-700">
                        Discover Our Handpicked Selections of top-rated items just for you.
                     </span>
                
             </div>

             {isLoading ?(
                <Loader/>
             ):errorMessage?(
        <div className="flex justify-center items-center h-50">
          <FaExclamationTriangle className="text-slate-800 text-3xl mr-2" />
          <span className="text-slate-800 text-lg font-medium">
            {errorMessage}
          </span>
        </div>
      ): (<div className="pb-6 pt-14 grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
        
        {/* ✅ LOADING STATE (optional but good) */}
        {loading ? (
          <p className="text-center col-span-full">Loading...</p>
        ) : products && products.length > 0 ? (
          
          products.slice(0, 8).map((item, i) => (
            <ProductCard key={i} {...item} />
          ))

        ) : (
          <p className="text-center col-span-full">
            No products found
          </p>
        )}

      </div>)
            }
         
      
    </div>
    </div>
  );
};

export default Home;