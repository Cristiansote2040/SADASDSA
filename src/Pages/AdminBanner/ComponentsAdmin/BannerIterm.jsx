export default function BannerItem({
  item,
  idx,
  items,
  setItems,
  canDrag,
  handleText,
  handleSelectedColor,
  confirmTextColor,
  handleQuickPosition,
  categories,
  products,
  PAGES,
}) {
  return (
    <div className="item">
      <h3>Item {idx + 1}</h3>

      {canDrag &&
        ["title", "subtitle", "paragraph"].map((field) => (
          <div key={field} className="field-group">
            <label className="label-strong">{field}</label>

            <input
              className="input"
              value={item[field].text || ""}
              onChange={(e) =>
                handleText(idx, field, "text", e.target.value)
              }
            />

            <div className="row wrap">
              <input
                type="color"
                value={item[field].selected}
                onChange={(e) =>
                  handleSelectedColor(idx, field, e.target.value)
                }
              />

              <button
                type="button"
                className="btn small"
                onClick={() => confirmTextColor(idx, field)}
              >
                ✔
              </button>

              <input
                type="number"
                value={(item[field].x ?? 0.5) * 100}
                onChange={(e) =>
                  handleText(
                    idx,
                    field,
                    "x",
                    Number(e.target.value) / 100
                  )
                }
              />

              <input
                type="number"
                value={(item[field].y ?? 0.5) * 100}
                onChange={(e) =>
                  handleText(
                    idx,
                    field,
                    "y",
                    Number(e.target.value) / 100
                  )
                }
              />

              <div className="row">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() =>
                    handleQuickPosition(idx, field, "top")
                  }
                >
                  Top
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() =>
                    handleQuickPosition(idx, field, "center")
                  }
                >
                  Center
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() =>
                    handleQuickPosition(idx, field, "bottom")
                  }
                >
                  Bottom
                </button>
              </div>

              
            </div>

            <input
              type="number"
              placeholder="Tamaño (px)"
              value={item[field].fontSize || ""}
              onChange={(e) =>
                handleText(
                  idx,
                  field,
                  "fontSize",
                  Number(e.target.value)
                )
              }
            />

            <select
              value={item[field].fontFamily || "Arial"}
              onChange={(e) =>
                handleText(idx, field, "fontFamily", e.target.value)
              }
            >
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
        ))}
        <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={item.overlay ?? 0.35}
                onChange={(e) =>
                  setItems((prev) => {
                    const newItems = [...prev];
                    newItems[idx].overlay = parseFloat(e.target.value);
                    return newItems;
                  })
                }
              />
      {/* LINK */}
      <div className="field">
        <label>Link</label>

        <select
          value={item.linkType || "none"}
          onChange={(e) => {
            const newItems = [...items];
            newItems[idx].linkType = e.target.value;
            newItems[idx].link = "";
            newItems[idx].categoryId = "";
            newItems[idx].productId = "";
            newItems[idx].page = "";
            setItems(newItems);
          }}
        >
          <option value="none">Sin link</option>
          <option value="category">Categoría</option>
          <option value="product">Producto</option>
          <option value="direct">Link directo</option>
          <option value="page">Página interna</option>
        </select>

        {item.linkType === "direct" && (
          <input
            type="text"
            placeholder="https://ejemplo.com"
            value={item.link || ""}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx].link = e.target.value;
              setItems(newItems);
            }}
          />
        )}

        {item.linkType === "category" && (
          <select
            value={item.categoryId || ""}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx].categoryId = e.target.value;
              newItems[idx].link = e.target.value
                ? `/category/${e.target.value}`
                : "";
              setItems(newItems);
            }}
          >
            <option value="">Selecciona categoría</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {item.linkType === "product" && (
          <select
            value={item.productId || ""}
            onChange={(e) => {
              const newItems = [...items];
              const selectedProduct = products.find(
                (p) => p._id === e.target.value
              );
              newItems[idx].productId = e.target.value;
              newItems[idx].link = selectedProduct
                ? `/product/${selectedProduct._id}`
                : "";
              setItems(newItems);
            }}
          >
            <option value="">Selecciona producto</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {item.linkType === "page" && (
          <select
            value={item.page || ""}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx].page = e.target.value;
              newItems[idx].link = e.target.value
                ? `/${e.target.value}`
                : "";
              setItems(newItems);
            }}
          >
            <option value="">Selecciona página</option>
            {PAGES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}