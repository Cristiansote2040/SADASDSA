import { Link } from "react-router-dom";

export default function BannerItem({ item, height, preview, isGrid = false }) {
  const imgSrc = preview
    ? item.imageUrl
    : `http://localhost:5000/uploads/${item.imageUrl}`;

  const elements = [
    item.title && { ...item.title, type: "h1" },
    item.subtitle && { ...item.subtitle, type: "h2" },
    item.paragraph && { ...item.paragraph, type: "p" },
  ].filter(Boolean);

  const positions = { top: [], center: [], bottom: [] };
  elements.forEach((el) => positions[el.position || "center"].push(el));

  const renderElement = (el, idx) => {
    const style = {
      color: el.color || "#fff",
      textAlign: "center",
      margin: isGrid ? 0 : 2,
      wordBreak: "break-word",
      fontSize: "clamp(14px, 2vw, 36px)",
      lineHeight: 1.3,
    };

    if (el.type === "h1")
      return (
        <h1 key={idx} style={style}>
          {el.text}
        </h1>
      );
    if (el.type === "h2")
      return (
        <h2 key={idx} style={style}>
          {el.text}
        </h2>
      );
    if (el.type === "p")
      return (
        <p key={idx} style={style}>
          {el.text}
        </p>
      );

    return null;
  };

  const renderTextBlock = (elements) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: "100%",
      }}
    >
      {elements.map(renderElement)}
    </div>
  );

  const BannerContent = (
    <>
      <img
        src={imgSrc}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${item.overlay ?? 0.1})`,
          pointerEvents: "none",
        }}
      />
    </>
  );

  return (
    <div
      style={{
        width: "100%",
        height: height || "100%",
        position: "relative",
        padding: 12,
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      {item.imageUrl &&
        (item.link ? (
          <Link
            to={item.link}
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            {BannerContent}
          </Link>
        ) : (
          BannerContent
        ))}

      {positions.top.length > 0 && renderTextBlock(positions.top)}
      {positions.center.length > 0 && renderTextBlock(positions.center)}
      {positions.bottom.length > 0 && renderTextBlock(positions.bottom)}
    </div>
  );
}
