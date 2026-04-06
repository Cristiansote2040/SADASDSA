import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import Loading from "../Components/Loading";
import ErrorPage from "../Components/ErrorPage";
import "../Styles/Products.css";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || null;
  const initialPage = Number(searchParams.get("page")) || 1;
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    search: initialSearch,
    category: initialCategory,
    promo: false,
    min: 0,
    max: 999999,
    sort: "",
  });

  const [tempFilters, setTempFilters] = useState({
    search: initialSearch,
    category: initialCategory,
    promo: false,
    min: "",
    max: "",
    sort: "",
    showCategories: true,
    showSort: false,
    showPrice: false,
  });

  const [currentPage, setCurrentPage] = useState(initialPage);
  const productsPerPage = 10;

  // 🔹 TRAER PRODUCTOS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProducts({
          page: currentPage,
          limit: productsPerPage,
          category: filters.category,
          promo: filters.promo,
          search: filters.search,
          min: filters.min,
          max: filters.max,
        });
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetch products:", err);
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.msg || "Error cargando productos",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, filters]);

  // 🔹 TRAER CATEGORÍAS
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error cargando categorías");
      }
    };
    fetchCategories();
  }, []);

  // 🔹 ACTUALIZAR FILTERS SI CAMBIA SEARCHPARAMS (header submit)
  useEffect(() => {
    const s = searchParams.get("search") || "";
    setFilters((prev) => ({ ...prev, search: s }));
    setTempFilters((prev) => ({ ...prev, search: s }));
  }, [searchParams]);

  if (loading) return <Loading text="Cargando productos..." />;
  if (error) return <ErrorPage code={error.code} message={error.message} />;

  // 🔹 PAGINACIÓN INTELIGENTE
  const getPagination = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    const newParams = {};
    if (filters.search) newParams.search = filters.search;
    if (filters.category) newParams.category = filters.category;
    if (page > 1) newParams.page = page; // solo agregar page si >1
    setSearchParams(newParams);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 APLICAR FILTROS (botón "Aplicar filtros" o header search)
  // 🔹 APLICAR FILTROS (botón "Aplicar filtros")
  const applyFilters = () => {
    // 1️⃣ Actualizar filtros reales
    setFilters({
      search: tempFilters.search, // esto solo se usa si es desde el header search
      category: tempFilters.category,
      promo: tempFilters.promo,
      min: Number(tempFilters.min) || 0,
      max: Number(tempFilters.max) || 999999,
      sort: tempFilters.sort,
    });
    setCurrentPage(1);

    // 2️⃣ Actualizar URL
    const newParams = {};
    if (tempFilters.category) newParams.category = tempFilters.category;
    if (tempFilters.promo) newParams.promo = true;
    if (tempFilters.min) newParams.min = tempFilters.min;
    if (tempFilters.max) newParams.max = tempFilters.max;
    if (tempFilters.sort) newParams.sort = tempFilters.sort;
    newParams.page = 1;

    // ❌ NUNCA agregamos search aquí, se limpia automáticamente
    setSearchParams(newParams);
  };

  // 🔹 CAMBIAR CATEGORÍA (limpia search automáticamente)
  const handleCategory = (cat) => {
    setTempFilters((prev) => ({ ...prev, category: cat }));

    const newParams = {};
    if (cat) newParams.category = cat;
    if (tempFilters.promo) newParams.promo = true;
    newParams.page = 1;

    setSearchParams(newParams);
    setCurrentPage(1);
  };

  // 🔹 TOGGLE PROMO (limpia search automáticamente)
  const handlePromoToggle = () => {
    const newPromo = !tempFilters.promo;
    setTempFilters((prev) => ({ ...prev, promo: newPromo }));

    const newParams = {};
    if (tempFilters.category) newParams.category = tempFilters.category;
    if (newPromo) newParams.promo = true;
    newParams.page = 1;

    setSearchParams(newParams);
    setCurrentPage(1);
  };

  return (
    <div className="products-layout">
       <button
        className="show-filters-btn"
        onClick={() => setShowFiltersMobile(prev => !prev)}
      >
        {showFiltersMobile ? "Ocultar filtros" : "Mostrar filtros"}
      </button>

      {/* SIDEBAR */}
       <aside className={`filters-sidebar ${showFiltersMobile ? "open" : ""}`}>
        <h3>Filtros</h3>

        {/* CATEGORÍAS DESPLEGABLE */}
        <div className="filter-section">
          <div
            className="filter-header"
            onClick={() =>
              setTempFilters((prev) => ({
                ...prev,
                showCategories: !prev.showCategories,
              }))
            }
          >
            <h4>Categorías</h4>
            <span>▾</span>
          </div>
          <div
            className={`categories ${tempFilters.showCategories ? "open" : ""}`}
          >
            <button
              className={!tempFilters.category ? "active" : ""}
              onClick={() => setTempFilters({ ...tempFilters, category: null })}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={
                  tempFilters.category === String(cat._id) ? "active" : ""
                }
                onClick={() =>
                  setTempFilters({ ...tempFilters, category: cat._id })
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* OFERTAS */}

        {/* PRECIO DESPLEGABLE */}
        <div className="filter-section">
          <div
            className="filter-header"
            onClick={() =>
              setTempFilters((prev) => ({
                ...prev,
                showPrice: !prev.showPrice,
              }))
            }
          >
            <h4>Precio</h4>
            <span>▾</span>
          </div>
          <div className={`categories ${tempFilters.showPrice ? "open" : ""}`}>
            <input
              type="number"
              placeholder="Mínimo"
              value={tempFilters.min}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, min: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Máximo"
              value={tempFilters.max}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, max: e.target.value })
              }
            />
          </div>
        </div>

        {/* ORDEN DESPLEGABLE */}
        <div className="filter-section">
          <div
            className="filter-header"
            onClick={() =>
              setTempFilters((prev) => ({ ...prev, showSort: !prev.showSort }))
            }
          >
            <h4>Ordenar</h4>
            <span>▾</span>
          </div>
          <div className={`categories ${tempFilters.showSort ? "open" : ""}`}>
            <button
              className={tempFilters.sort === "az" ? "active" : ""}
              onClick={() => setTempFilters({ ...tempFilters, sort: "az" })}
            >
              A → Z
            </button>
            <button
              className={tempFilters.sort === "za" ? "active" : ""}
              onClick={() => setTempFilters({ ...tempFilters, sort: "za" })}
            >
              Z → A
            </button>
            <button
              className={tempFilters.sort === "price_asc" ? "active" : ""}
              onClick={() =>
                setTempFilters({ ...tempFilters, sort: "price_asc" })
              }
            >
              Precio ↑
            </button>
            <button
              className={tempFilters.sort === "price_desc" ? "active" : ""}
              onClick={() =>
                setTempFilters({ ...tempFilters, sort: "price_desc" })
              }
            >
              Precio ↓
            </button>
          </div>
          <div className="filter-section">
            <h4>Ofertas</h4>
            <button
              className={`promo-btn ${tempFilters.promo ? "active" : ""}`}
              onClick={() =>
                setTempFilters({ ...tempFilters, promo: !tempFilters.promo })
              }
            >
              🔥 Solo ofertas
            </button>
          </div>
        </div>

        <button className="apply-btn" onClick={applyFilters}>
          Aplicar filtros
        </button>
      </aside>

      {/* PRODUCTOS */}
      <main className="products-content">
        <p className="results-info">
          Mostrando <strong>{(currentPage - 1) * productsPerPage + 1}</strong> -{" "}
          <strong>{Math.min(currentPage * productsPerPage, total)}</strong> de{" "}
          <strong>{total}</strong> productos
        </p>

        <div className="product-list">
          {products
            .slice()
            .sort((a, b) => {
              if (filters.sort === "az") return a.name.localeCompare(b.name);
              if (filters.sort === "za") return b.name.localeCompare(a.name);
              if (filters.sort === "price_asc")
                return (
                  (a.isPromo
                    ? a.discountedPrice || a.variants?.[0]?.price
                    : a.variants?.[0]?.price) -
                  (b.isPromo
                    ? b.discountedPrice || b.variants?.[0]?.price
                    : b.variants?.[0]?.price)
                );
              if (filters.sort === "price_desc")
                return (
                  (b.isPromo
                    ? b.discountedPrice || b.variants?.[0]?.price
                    : b.variants?.[0]?.price) -
                  (a.isPromo
                    ? a.discountedPrice || a.variants?.[0]?.price
                    : a.variants?.[0]?.price)
                );
              return 0;
            })
            .map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
        </div>

        {/* PAGINACIÓN */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {getPagination().map((p) => (
            <button
              key={p}
              className={currentPage === p ? "active" : ""}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </main>
    </div>
  );
}
