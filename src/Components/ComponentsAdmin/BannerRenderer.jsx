// src/Components/ComponentsAdmin/BannerRenderer.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BannerItem from "../ComponentsAdmin/BannerItem";

export default function BannerRenderer({ banners, displayTypeOverride }) {
  if (!banners || banners.length === 0) return null;

  return (
    <>
      {banners.map((b) => {
        const displayType = displayTypeOverride || b.displayType;

        return (
          <div key={b._id} style={{ backgroundColor: b.backgroundColor || "#fff", marginBottom: 20 }}>
            {displayType === "carousel" && (
              <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                loop={b.items.length > 1}
              >
                {b.items.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <BannerItem item={item} displayType={displayType} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {displayType === "grid" && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 10
              }}>
                {b.items.map((item, idx) => (
                  <BannerItem key={idx} item={item} displayType={displayType} />
                ))}
              </div>
            )}

            {(displayType === "text-overlay" || displayType === "hero") && (
              <div>
                {b.items.map((item, idx) => (
                  <BannerItem key={idx} item={item} displayType={displayType} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}