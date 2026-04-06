import { useEffect, useState, useRef } from "react";
import { getBanners } from "../../services/bannerService";
import BannerRenderer from "./Component/BannerRenderer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-cube";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-flip";
import "../../Styles/Components/BannerManager.css";
// Map de tamaños
const sizeMap = {
  hero: { desktop: 650, mobile: 420 },
  large: { desktop: 450, mobile: 300 },
  medium: { desktop: 350, mobile: 240 },
  small: { desktop: 220, mobile: 160 },
  mini: { desktop: 120, mobile: 90 },
  tiny: { desktop: 80, mobile: 60 },
  micro: { desktop: 50, mobile: 40 },
};

// Devuelve altura según tamaño y si es mobile
function getHeight(banner) {
  const isMobile = window.innerWidth < 768;
  if (banner.sizeType === "custom") {
    const desktop = Number(banner.heightDesktop) || 350;
    const mobile = Number(banner.heightMobile) || 220;
    return isMobile ? mobile : desktop;
  }
  const size = sizeMap[banner.sizeType] || sizeMap.medium;
  return isMobile ? size.mobile : size.desktop;
}

export default function BannerManager({
  page,
  position,
  banners,
  preview,
  onPositionChange, // 👈 esto
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (preview) {
      setData(banners || []);
      return;
    }

    if (banners) {
      setData(banners);
      return;
    }

    const load = async () => {
      try {
        const res = await getBanners(page, position);
        setData(res.data || []);
      } catch (err) {
      }
    };

    if (page && position) load();
  }, [page, position, preview, banners]);

  if (!data.length) return null;

  return (
    <>
      {data.map((banner, index) => {
  const height = getHeight(banner);

  return (
    <BannerRenderer
      key={banner._id || index}
      banner={banner}
      height={height}
      preview={preview}
      index={index}
      onPositionChange={onPositionChange}
      setData={setData}
    />
  );
})}
    </>
  );
}
