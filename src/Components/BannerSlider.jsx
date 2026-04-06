import { useState, useEffect } from "react";

export default function BannerSlider({ banners }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="banner-slider">
      <a href={banners[index].link || "#"}>
        <img src={banners[index].image} alt={banners[index].title} />
      </a>
    </div>
  );
}