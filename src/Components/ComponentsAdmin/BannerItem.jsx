// src/Components/ComponentsBanners/BannerItem.jsx
export default function BannerItem({ item, displayType }) {
  const isOverlay = displayType === "text-overlay" || displayType === "hero";

  // Contenedor simple si no es overlay
  if (!isOverlay) {
    return <img
      src={`/uploads/${item.imageUrl}`}
      alt={item.title?.text || "banner"}
      style={{ width: "100%", display: "block" }}
    />;
  }

  // Overlay / Hero: texto en contenedor, imagen abajo
  return (
    <div style={{
      backgroundColor: item.backgroundColor || "#fff",
      padding: 20,
      textAlign: "center",
      borderRadius: 8,
    }}>
      <div style={{ marginBottom: 10 }}>
        {item.title?.text && <h1 style={{ color: item.title.color }}>{item.title.text}</h1>}
        {item.subtitle?.text && <h3 style={{ color: item.subtitle.color }}>{item.subtitle.text}</h3>}
        {item.paragraph?.text && <p style={{ color: item.paragraph.color }}>{item.paragraph.text}</p>}
      </div>

      <img
        src={`/uploads/${item.imageUrl}`}
        alt={item.title?.text || "banner"}
        style={{ width: "100%", display: "block", borderRadius: 6 }}
      />
    </div>
  );
}