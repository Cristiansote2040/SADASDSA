export default function BannerAppearance({
  selectedColor,
  setSelectedColor,
  confirmBannerColor,
  sizeType,
  heightDesktop,
  setHeightDesktop,
  heightMobile,
  setHeightMobile,
  displayType,
  handleImages,
  padding,          // 🔹 nuevo
  setPadding,       // 🔹 nuevo
  borderRadius,     // 🔹 nuevo
  setBorderRadius,  // 🔹 nuevo
}) {
  return (
    <>
      {/* COLOR */}
      <div className="row section">
        <label>Color fondo</label>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
        <button
          type="button"
          onClick={confirmBannerColor}
          className="btn secondary"
        >
          Confirmar
        </button>
      </div>

      {/* CUSTOM HEIGHT */}
      {sizeType === "custom" && (
        <div className="grid-2 section">
          <input
            type="number"
            placeholder="Altura desktop"
            value={heightDesktop}
            onChange={(e) => setHeightDesktop(e.target.value)}
          />
          <input
            type="number"
            placeholder="Altura mobile"
            value={heightMobile}
            onChange={(e) => setHeightMobile(e.target.value)}
          />
        </div>
      )}

      {/* PADDING y BORDER RADIUS */}
      <div className="grid-2 section">
        <input
          type="number"
          min={0}
          placeholder="Padding (px)"
          value={padding}
          onChange={(e) => setPadding(Number(e.target.value))}
        />
        <input
          type="number"
          min={0}
          placeholder="Border Radius (px)"
          value={borderRadius}
          onChange={(e) => setBorderRadius(Number(e.target.value))}
        />
      </div>

      {/* IMÁGENES */}
      {displayType !== "text-banner" && (
        <div className="section">
          <input
            type="file"
            multiple
            onChange={handleImages}
            className="input file"
          />
        </div>
      )}
    </>
  );
}