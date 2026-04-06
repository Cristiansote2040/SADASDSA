import BannerItem from "./BannerItem";

export default function BannerGrid({
  items,
  preview,
  backgroundColor = "#e0e0e0",
  gap = 0,
}) {
  const itemCount = items.length;
  let columns = Math.ceil(Math.sqrt(itemCount));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
        width: "100%",
        height: "100%",
        padding: 5,
        boxSizing: "border-box",
        backgroundColor: backgroundColor,
        justifyItems: "stretch",
        alignItems: "stretch",
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            width: "100%",
            aspectRatio: "1/1",
            overflow: "hidden",
            borderRadius: 12,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BannerItem item={item} preview={preview} isGrid />
        </div>
      ))}
    </div>
  );
}