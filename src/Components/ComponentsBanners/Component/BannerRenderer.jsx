import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
} from "swiper/modules";

import BannerItem from "./BannerItem";
import BannerItemDraggableOverlay from "../Component/BannerItemDraggableOverlay";
import BannerGrid from "../Component/BannerGrid";
import BannerGridText from "../Component/BannerGridText";

export default function BannerRenderer({
  banner,
  height,
  preview,
  index,
  onPositionChange,
  setData,
}) {
  const handlePositionChange = (itemIdx, field, x, y) => {
    if (onPositionChange) {
      onPositionChange(index, itemIdx, field, x, y);
    } else {
      setData((prev) => {
        const newData = [...prev];
        newData[index].items[itemIdx][field].x = x;
        newData[index].items[itemIdx][field].y = y;
        return newData;
      });
    }
  };

  return (
    <div style={{ width: "100%", height, marginBottom: 0 }}>
      {/* CAROUSEL */}
      {banner.displayType === "carousel" && banner.items.length > 0 && (
        <Swiper
          modules={[
            Autoplay,
            Navigation,
            Pagination,
            EffectFade,
            EffectCube,
            EffectCoverflow,
            EffectFlip,
          ]}
          effect={banner.carouselSettings?.effect || "slide"}
          navigation={banner.carouselSettings?.arrows ?? true}
          pagination={
            banner.carouselSettings?.dots ? { clickable: true } : false
          }
          autoplay={{
            delay: banner.carouselSettings?.autoplayDelay || 4000,
            disableOnInteraction: false,
          }}
          loop={banner.items.length > 1}
          style={{
            width: "100%",
            height: "100%",
            "--swiper-navigation-color":
              banner.carouselSettings?.arrowsColor || "#000",
            "--swiper-pagination-color":
              banner.carouselSettings?.dotsColor || "#000",
            "--swiper-navigation-size":
              banner.carouselSettings?.arrowsSize || "24px",
          }}
        >
          {banner.items.map((item, i) => (
            <SwiperSlide
              key={i}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <BannerItemDraggableOverlay
                item={item}
                preview={preview}
                height={height}
                idx={i}
                onPositionChange={handlePositionChange}
                isEditing={preview} // o false si es solo vista
                padding={item.padding ?? banner.padding ?? 0} // <-- nuevo
                borderRadius={item.borderRadius ?? banner.borderRadius ?? 0} // <-- nuevo
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* HERO */}
      {banner.displayType === "hero" &&
        banner.items.map((item, i) => (
          <BannerItem key={i} item={item} preview={preview} />
        ))}

      {/* GRID */}
      {banner.displayType === "grid" && (
        <BannerGrid items={banner.items} preview={preview} />
      )}

      {/* GRID TEXT */}
      {banner.displayType === "grid-text" && (
        <BannerGridText
          banner={banner}
          preview={preview}
          getHeight={getHeight}
        />
      )}

      {/* IMAGE TEXT */}
      {banner.displayType === "image-text" &&
        banner.items.map((item, i) => (
          <BannerItemDraggableOverlay
            item={item}
            preview={preview}
            height={height}
            idx={i}
            onPositionChange={handlePositionChange}
            isEditing={preview} // o false si es solo vista
            padding={item.padding ?? banner.padding ?? 0} // <-- nuevo
            borderRadius={item.borderRadius ?? banner.borderRadius ?? 0} // <-- nuevo
          />
        ))}

      {/* TEXT BANNER */}
      {banner.displayType === "text-banner" &&
        banner.items.map((item, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              display: "flex",
              height: "100%",
              flexDirection: "column",
              backgroundColor: item.backgroundColor || "#fff",
            }}
          >
            <BannerItemDraggableOverlay
              item={item}
              preview={preview}
              height={height}
              idx={i}
              onPositionChange={handlePositionChange}
              isEditing={preview} // o false si es solo vista
              padding={item.padding ?? banner.padding ?? 0} // <-- nuevo
              borderRadius={item.borderRadius ?? banner.borderRadius ?? 0} // <-- nuevo
            />
          </div>
        ))}
    </div>
  );
}
