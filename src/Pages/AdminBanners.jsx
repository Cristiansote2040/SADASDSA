import { useState, useEffect } from "react";
import { createBanner, getBanners } from "../services/bannerService";
import BannerManager from "../Components/ComponentsBanners/BannerManager";
import BannerConfig from "./AdminBanner/BannerConfig";
import CarouselSettings from "./AdminBanner/ComponentsAdmin/CarouselSettings";
import BannerItem from "./AdminBanner/ComponentsAdmin/BannerIterm";
import GridTextSettings from "./AdminBanner/ComponentsAdmin/CarouselSettings";
import TextBannerCreator from "./AdminBanner/ComponentsAdmin/TextBannerCreator";
import BannerAppearance from "./AdminBanner/BannerAppearance";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
import "../Styles/AdminBanners.css";
const DISPLAY_TYPES = [
  "carousel",
  "grid",
  "image-text",
  "hero",
  "text-banner",
  "grid-text",
];
const SIZE_TYPES = [
  "hero",
  "large",
  "medium",
  "small",
  "mini",
  "tiny",
  "micro",
  "custom",
];
const PAGES = [
  "home",
  "products",
  "product-detail",
  "cart",
  "checkout",
  "promotions",
  "profile",
  "login",
  "register",
  "pago-exitoso",
];
const PAGE_ZONES = {
  home: ["top", "middle", "bottom"],
  products: ["top", "bottom"],
  "product-detail": ["top", "bottom"],
  cart: ["top", "bottom"],
  checkout: ["top"],
  promotions: ["top", "bottom"],
  profile: ["top", "bottom"],
  login: ["top"],
  register: ["top"],
  "pago-exitoso": ["top"],
};

export default function AdminBanners() {
  // ------------------- Estados principales -------------------
  const [page, setPage] = useState("home");
  const [zone, setZone] = useState("top");
  const [displayType, setDisplayType] = useState("carousel");
  const [sizeType, setSizeType] = useState("medium");
  const [padding, setPadding] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const [heightDesktop, setHeightDesktop] = useState("");
  const [heightMobile, setHeightMobile] = useState("");

  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);

  const [order, setOrder] = useState(1);
  const [existingBanners, setExistingBanners] = useState([]);
  const [containerText, setContainerText] = useState({
    title: { text: "", color: "#000", position: "top", selected: "#000" },
    subtitle: { text: "", color: "#000", position: "center", selected: "#000" },
    paragraph: {
      text: "",
      color: "#000",
      position: "bottom",
      selected: "#000",
    },
    alignHorizontal: "center",
    alignVertical: "center",
  });
  const [carouselSettings, setCarouselSettings] = useState({
    arrows: true,
    arrowsColor: "#000000",
    dots: true,
    dotsColor: "#000000",
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------- Efectos iniciales -------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error trayendo categorías:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error trayendo productos:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        await loadBanners();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [page, zone]);

  const loadBanners = async () => {
    try {
      const res = await getBanners(page, zone);
      const sorted = (res.data || []).sort((a, b) => a.order - b.order);
      setExistingBanners(sorted);
    } catch (err) {
    }
  };

  // ------------------- Funciones auxiliares -------------------
  const confirmBannerColor = () => setBackgroundColor(selectedColor);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const newItems = files.map((file) => {
      const baseItem = {
        imageUrl: URL.createObjectURL(file),
        link: "",
        overlay: 0.01,
      };

      // Campos de texto para tipos que los necesitan
      if (["image-text", "text-banner", "carousel"].includes(displayType)) {
        baseItem.title = {
          text: "",
          color: "#fff",
          x: 0.5,
          y: 0.1,
          selected: "#fff",
          fontSize: 36,
          fontFamily: "Montserrat",
        };
        baseItem.subtitle = {
          text: "",
          color: "#fff",
          x: 0.5,
          y: 0.3,
          selected: "#fff",
          fontSize: 22,
          fontFamily: "Poppins",
        };
        baseItem.paragraph = {
          text: "",
          color: "#fff",
          x: 0.5,
          y: 0.5,
          selected: "#fff",
          fontSize: 16,
          fontFamily: "Arial",
        };
      }
      return baseItem;
    });

    setItems(newItems);
  };

  const addTextBanner = () => {
    setImages([]);
    setItems([
      {
        title: { text: "", color: "#000", position: "top", selected: "#000" },
        subtitle: {
          text: "",
          color: "#000",
          position: "center",
          selected: "#000",
        },
        paragraph: {
          text: "",
          color: "#000",
          position: "bottom",
          selected: "#000",
        },
        link: "",
      },
    ]);
  };

  const handleText = (idx, field, prop, value) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[idx][field][prop] = value;
      return newItems;
    });
  };

  const handleSelectedColor = (idx, field, value) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[idx][field].selected = value;
      return newItems;
    });
  };

  const confirmTextColor = (idx, field) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[idx][field].color = newItems[idx][field].selected;
      return newItems;
    });
  };

  const handleQuickPosition = (idx, field, position) => {
    let x = 0.5;
    let y = position === "top" ? 0.15 : position === "center" ? 0.5 : 0.85;

    const offsetMap = { title: -0.12, subtitle: 0, paragraph: 0.12 };
    y = Math.min(Math.max(y + offsetMap[field], 0), 1);

    handleText(idx, field, "x", x);
    handleText(idx, field, "y", y);
  };

  // ------------------- Submit banner -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsToSend = items.map((item) => ({
      ...item,
      link: item.link || "",
      linkType: item.linkType || "none",
      categoryId: item.categoryId || "",
      productId: item.productId || "",
      page: item.page || "",
      padding, // 🔹 agrega padding aquí
      borderRadius, // 🔹 agrega borderRadius aquí
    }));

    const formData = new FormData();
    formData.append("page", page);
    formData.append("padding", padding);
    formData.append("borderRadius", borderRadius);
    formData.append("position", zone);
    formData.append("displayType", displayType);
    formData.append("backgroundColor", backgroundColor);
    formData.append("sizeType", sizeType);
    formData.append("carouselSettings", JSON.stringify(carouselSettings));
    formData.append("items", JSON.stringify(itemsToSend));
    images.forEach((file) => formData.append("images", file));

    try {
      const res = await createBanner(formData);
      await loadBanners(); // 🔹 recarga banners existentes
      setItems([]);
      setImages([]);
    } catch (err) {
      console.error("Error creando banner:", err);
    }
  };

  // ------------------- Preview banner -------------------
  const previewBanner = {
    page,
    position: zone,
    displayType,
    sizeType,
    backgroundColor,
    heightDesktop,
    heightMobile,
    containerText,
    carouselSettings,
    items: items.map((item) => ({
      ...item,
      backgroundColor: item.backgroundColor || backgroundColor,
      padding,
      borderRadius,
    })),
  };

  const canDrag = ["carousel", "image-text", "text-banner"].includes(
    displayType,
  );

  // ------------------- Render -------------------
  return (
    <div className="container">
      <h2 className="title">Administrador de Banners</h2>

      <form onSubmit={handleSubmit} className="form">
        {/* GRID */}
        <BannerConfig
          page={page}
          setPage={setPage}
          zone={zone}
          setZone={setZone}
          displayType={displayType}
          setDisplayType={setDisplayType}
          sizeType={sizeType}
          setSizeType={setSizeType}
          PAGES={PAGES}
          PAGE_ZONES={PAGE_ZONES}
          DISPLAY_TYPES={DISPLAY_TYPES}
          SIZE_TYPES={SIZE_TYPES}
        />

        <BannerAppearance
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          confirmBannerColor={confirmBannerColor}
          sizeType={sizeType}
          heightDesktop={heightDesktop}
          setHeightDesktop={setHeightDesktop}
          heightMobile={heightMobile}
          setHeightMobile={setHeightMobile}
          displayType={displayType}
          handleImages={handleImages}
          padding={padding} // 🔹 agregado
          setPadding={setPadding} // 🔹 agregado
          borderRadius={borderRadius} // 🔹 agregado
          setBorderRadius={setBorderRadius} // 🔹 agregado
        />

        {displayType === "carousel" && (
          <CarouselSettings
            carouselSettings={carouselSettings}
            setCarouselSettings={setCarouselSettings}
          />
        )}

        {displayType === "grid-text" && (
          <GridTextSettings
            containerText={containerText}
            setContainerText={setContainerText}
          />
        )}

        {/* TEXT BANNER */}
        {displayType === "text-banner" && items.length === 0 && (
          <TextBannerCreator
            displayType={displayType}
            items={items}
            addTextBanner={addTextBanner}
          />
        )}

        {/* ITEMS */}
        {items.map((item, idx) => (
          <BannerItem
            key={idx}
            item={item}
            idx={idx}
            items={items}
            setItems={setItems}
            canDrag={canDrag}
            handleText={handleText}
            handleSelectedColor={handleSelectedColor}
            confirmTextColor={confirmTextColor}
            handleQuickPosition={handleQuickPosition}
            categories={categories}
            products={products}
            PAGES={PAGES}
          />
        ))}

        <button type="submit" className="btn primary big">
          Crear Banner
        </button>
      </form>

      {/* PREVIEW */}
      <div className="preview">
        <h3>Preview</h3>
        <div className="preview-box">
          {items.length > 0 && (
            <BannerManager
              banners={[previewBanner]}
              preview
              onPositionChange={(idx, field, x, y) => {
                setItems((prev) => {
                  const newItems = [...prev];
                  newItems[idx][field].x = x;
                  newItems[idx][field].y = y;
                  return newItems;
                });
              }}
            />
          )}
        </div>
      </div>

      {/* EXISTENTES */}
      <div className="existing">
        <h3>Banners existentes</h3>
        <BannerManager banners={existingBanners} />
      </div>
    </div>
  );
}
