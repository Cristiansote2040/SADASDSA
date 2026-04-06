import { useEffect, useState } from "react";
import BannerManager from "../Components/ComponentsBanners/BannerManager";
import { getBanners } from "../services/bannerService";

export default function PublicLayout({ children, page, positions = ["top", "middle", "bottom"] }) {
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    const checkBanners = async () => {
      try {
        const results = await Promise.all(
          positions.map(async (pos) => {
            const res = await getBanners(`${page}_${pos}`);
            return res.data.length ? pos : null;
          })
        );
        setAvailable(results.filter(Boolean));
      } catch (err) {
        console.error(err);
      }
    };
    checkBanners();
  }, [page, positions]);

  return (
    <>
      {available.includes("top") && <BannerManager page={page} position="top" />}
      {children}
      {available.includes("middle") && <BannerManager page={page} position="middle" />}
      {available.includes("bottom") && <BannerManager page={page} position="bottom" />}
    </>
  );
}