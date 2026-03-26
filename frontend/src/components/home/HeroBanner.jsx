import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { bannerLists } from "../../utils";
import { Link } from "react-router-dom";

const colors = [
  "bg-[var(--color-banner-color1)]",
  "bg-[var(--color-banner-color2)]",
  "bg-[var(--color-banner-color3)]"
];

const HeroBanner = () => {
  return (
    <div className="py-2 rounded-md">
      <Swiper
        grabCursor={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation
        modules={[Pagination, Navigation, Autoplay]}
        pagination={{ clickable: true }}
        slidesPerView={1}
      >
        {bannerLists.map((item, i) => {
          const colorClass = colors[i % colors.length];

          return (
            <SwiperSlide key={item.id}>
              <div
                className={`rounded-md sm:h-[500px] h-auto ${colorClass} flex flex-col lg:flex-row items-center justify-between px-12 lg:px-20`}
              >
                {/* TEXT */}
                <div className="w-full lg:w-[45%] text-center lg:text-left">
                  <h3 className="text-2xl md:text-3xl text-white font-bold">
                    {item.title}
                  </h3>

                  <h1 className="text-3xl md:text-5xl text-white font-bold mt-2">
                    {item.subtitle}
                  </h1>

                  <p className="text-white mt-3">
                    {item.description}
                  </p>

                  <Link
                    to="/products"
                    className="mt-6 inline-block bg-black text-white py-2 px-4 hover:bg-gray-800 rounded"
                  >
                    Shop
                  </Link>
                </div>

                {/* IMAGE */}
                <div className="w-full lg:w-[45%] flex justify-center mt-4 lg:mt-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-[300px] md:w-[400px] lg:w-[500px] object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HeroBanner;