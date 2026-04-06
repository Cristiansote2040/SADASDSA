export default function BannerConfig({
  page,
  setPage,
  zone,
  setZone,
  displayType,
  setDisplayType,
  sizeType,
  setSizeType,
  PAGES,
  PAGE_ZONES,
  DISPLAY_TYPES,
  SIZE_TYPES,
}) {
  return (
    <div className="grid-4">
      <div className="field">
        <label>Página</label>
        <select value={page} onChange={(e) => setPage(e.target.value)}>
          {PAGES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Zona</label>
        <select value={zone} onChange={(e) => setZone(e.target.value)}>
          {PAGE_ZONES[page].map((z) => (
            <option key={z}>{z}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Tipo</label>
        <select
          value={displayType}
          onChange={(e) => setDisplayType(e.target.value)}
        >
          {DISPLAY_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Tamaño</label>
        <select
          value={sizeType}
          onChange={(e) => setSizeType(e.target.value)}
        >
          {SIZE_TYPES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}