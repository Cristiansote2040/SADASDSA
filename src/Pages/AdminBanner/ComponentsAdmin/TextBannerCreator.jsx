export default function TextBannerCreator({
  displayType,
  items,
  addTextBanner,
}) {
  if (displayType !== "text-banner" || items.length > 0) return null;

  return (
    <button
      type="button"
      onClick={addTextBanner}
      className="btn primary"
    >
      Crear bloque texto
    </button>
  );
}