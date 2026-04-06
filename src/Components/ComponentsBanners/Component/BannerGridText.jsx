import { Link } from "react-router-dom";

export default function BannerGridText({
  banner,
  preview,
  getHeight, // 👈 IMPORTANTE
  backgroundColor = "#f5f5f5",
  gap = 12,
}) {
  const totalHeight = getHeight(banner);
  const items = banner.items || [];
  const itemCount = items.length;

  const textHeight = 60 + (banner.containerText?.padding || 12) * 2;
  const gridHeight = totalHeight - textHeight;

  const columns = Math.ceil(Math.sqrt(itemCount));
  const rows = Math.ceil(itemCount / columns);

  const rowHeight = (gridHeight - gap * (rows - 1)) / rows;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: totalHeight,
        boxSizing: "border-box",
        backgroundColor,
        gap: 5,
      }}
    >
      {/* TEXTO */}
      <div
        style={{
          padding: banner.containerText?.padding || 0,
          textAlign: banner.containerText?.alignHorizontal || "center",
          flexShrink: 0,
        }}
      >
        {banner.containerText?.title?.text && (
          <h2 style={{ color: banner.containerText.title.color }}>
            {banner.containerText.title.text}
          </h2>
        )}

        {banner.containerText?.subtitle?.text && (
          <h4 style={{ color: banner.containerText.subtitle.color }}>
            {banner.containerText.subtitle.text}
          </h4>
        )}

        {banner.containerText?.paragraph?.text && (
          <p style={{ color: banner.containerText.paragraph.color }}>
            {banner.containerText.paragraph.text}
          </p>
        )}
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
          width: "100%",
          height: "100%",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: rowHeight,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {item.link ? (
              <Link to={item.link} style={{ width: "100%", height: "100%" }}>
                <img
                  src={
                    preview
                      ? item.imageUrl
                      : `http://localhost:5000/uploads/${item.imageUrl}`
                  }
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Link>
            ) : (
              <img
                src={
                  preview
                    ? item.imageUrl
                    : `http://localhost:5000/uploads/${item.imageUrl}`
                }
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}