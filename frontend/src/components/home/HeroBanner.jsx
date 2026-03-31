import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { bannerLists } from "../../utils";
import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";

const colors = [
  "bg-[var(--color-banner-color1)]",
  "bg-[var(--color-banner-color2)]",
  "bg-[var(--color-banner-color3)]"
];

const HeroBanner = () => {
  return (
    <div className="hero-swiper overflow-hidden rounded-[2rem] py-2">
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
                className={`relative overflow-hidden rounded-[2rem] sm:h-[520px] h-auto ${colorClass} flex flex-col lg:flex-row items-center justify-between px-8 py-10 lg:px-20`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />
                <div className="relative w-full lg:w-[45%] text-center lg:text-left">
                  <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
                    Curated living
                  </span>
                  <h3 className="mt-6 text-2xl font-bold text-white/90 md:text-3xl">
                    {item.title}
                  </h3>

                  <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                    {item.subtitle}
                  </h1>

                  <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
                    {item.description}
                  </p>

                  <Link
                    to="/products"
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-xl transition hover:scale-105 hover:bg-slate-100"
                  >
                    Shop now
                    <LuArrowRight />
                  </Link>
                </div>

                <div className="relative mt-8 flex w-full justify-center lg:mt-0 lg:w-[45%]">
                  <div className="absolute inset-0 mx-auto h-[280px] w-[280px] rounded-full bg-white/12 blur-3xl" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="relative w-[300px] object-contain drop-shadow-[0_28px_55px_rgba(15,23,42,0.32)] transition-transform duration-500 hover:scale-105 md:w-[400px] lg:w-[500px]"
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
