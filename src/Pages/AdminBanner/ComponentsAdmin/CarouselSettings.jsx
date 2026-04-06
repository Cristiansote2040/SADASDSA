export default function CarouselSettings({
  carouselSettings,
  setCarouselSettings,
  padding,
  borderradius
}) {
  return (
    <div className="card section">
      <h4>Configuración Carrusel</h4>

      <div className="row between">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={carouselSettings.arrows}
            onChange={(e) =>
              setCarouselSettings((prev) => ({
                ...prev,
                arrows: e.target.checked,
              }))
            }
          />
          Flechas
        </label>

        {carouselSettings.arrows && (
          <input
            type="color"
            value={carouselSettings.arrowsColor}
            onChange={(e) =>
              setCarouselSettings((prev) => ({
                ...prev,
                arrowsColor: e.target.value,
              }))
            }
          />
        )}
      </div>

      <div className="row between">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={carouselSettings.dots}
            onChange={(e) =>
              setCarouselSettings((prev) => ({
                ...prev,
                dots: e.target.checked,
              }))
            }
          />
          Puntos
        </label>

        {carouselSettings.dots && (
          <input
            type="color"
            value={carouselSettings.dotsColor}
            onChange={(e) =>
              setCarouselSettings((prev) => ({
                ...prev,
                dotsColor: e.target.value,
              }))
            }
          />
        )}
      </div>
    </div>
  );
}