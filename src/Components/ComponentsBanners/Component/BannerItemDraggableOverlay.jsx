import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import '../../../Styles/Components/Banner.css'
export default function BannerItemDraggableOverlay({
  item,
  height,
  preview,
  idx,
  onPositionChange,
  padding = 0,
  borderRadius = 0,
  isEditing = false,
}) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const imgSrc = preview
    ? item.imageUrl
    : `http://localhost:5000/uploads/${item.imageUrl}`;

  const elements = [
    item.title && { ...item.title, type: "h1" },
    item.subtitle && { ...item.subtitle, type: "h2" },
    item.paragraph && { ...item.paragraph, type: "p" },
  ].filter(Boolean);

  const typeToField = { h1: "title", h2: "subtitle", p: "paragraph" };

  // ------------------ Drag logic ------------------
  useEffect(() => {
    if (!dragging || !isEditing) return;

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      let x = (e.clientX - rect.left) / rect.width;
      let y = (e.clientY - rect.top) / rect.height;

      x = Math.min(Math.max(x, 0), 1);
      y = Math.min(Math.max(y, 0), 1);

      onPositionChange(idx, dragging, x, y);
    };

    const handleMouseUp = () => setDragging(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, idx, onPositionChange, isEditing]);

  const handleMouseDown = (field) => (e) => {
    if (!isEditing) return;
    const tag = e.target.tagName.toLowerCase();
    if (["input", "textarea", "select"].includes(tag)) return;
    setDragging(field);
  };

  // ------------------ Render ------------------
  const content = (
    <>
      {/* IMAGEN */}
      <img
        src={imgSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius,
          display: "block",
        }}
      />

      {/* OVERLAY */}
      <div
        className="banner-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(0,0,0,${item.overlay ?? 0.35})`,
          pointerEvents: "none",
          borderRadius, // 🔹 overlay respeta el borderRadius
        }}
      />

      {/* DRAGGABLE TEXT */}
      <div
        ref={containerRef}
        className="banner-draggable-container"
        style={{ position: "absolute", inset: 0 }}
      >
        {elements.map((el, i) => {
          const field = typeToField[el.type];
          return (
            <div
              key={i}
              className="banner-draggable-element"
              style={{
                left: `${(el.x ?? 0.5) * 100}%`,
                top: `${(el.y ?? 0.5) * 100}%`,
                transform: "translate(-50%, -50%)",
                color: el.color || "#fff",
                fontSize: el.fontSize
                  ? `${el.fontSize}px`
                  : "clamp(14px, 2.2vw, 22px)",
                fontFamily: el.fontFamily || "inherit",
                fontWeight: el.type === "h1" ? "bold" : "normal",
                position: "absolute",
                cursor: isEditing ? "grab" : "default",
                userSelect: "none",
                pointerEvents: isEditing ? "auto" : "none",
              }}
              onMouseDown={handleMouseDown(field)}
            >
              {el.text}
            </div>
          );
        })}
      </div>
    </>
  );

  // ------------------ Wrapper final ------------------
  return (
    <div
      style={{
        height,
        width:'100%',
          padding,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="banner-wrapper"
        style={{
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          borderRadius,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {item.link ? (
          <Link to={item.link} style={{ display: "block", height: "100%" }}>
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  );
}