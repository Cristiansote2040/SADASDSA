import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "../services/productService";
import { AuthContext } from "../Context/AuthContext"; // 🔥
import ErrorPage from "../Components/ErrorPage";
import "../Styles/Components/AdminProductForm.css";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { setMessage } = useContext(AuthContext); // 🔥

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    tags: "",
    isPromo: false,
    isActive: true,
    image: null,
    preview: "",
  });

  const [dates, setDates] = useState({
    createdAt: "",
    updatedAt: "",
  });

  const [error, setError] = useState(null);

  const isEdit = !!id;

  // =====================
  // FETCH (ERROR GRAVE)
  // =====================
  useEffect(() => {
    if (isEdit) {
      const fetch = async () => {
        try {
          const res = await getProductById(id);
          const p = res.data;

          setForm({
            name: p.name || "",
            description: p.description || "",
            price: p.variants?.[0]?.price || "",
            stock: p.variants?.[0]?.stock || "",
            tags: p.tags?.join(", ") || "",
            isPromo: p.isPromo || false,
            isActive: p.isActive ?? true,
            image: null,
            preview: p.image || "",
          });

          setDates({
            createdAt: new Date(p.createdAt).toLocaleString(),
            updatedAt: new Date(p.updatedAt).toLocaleString(),
          });
        } catch (err) {

          // 🚨 ERROR GLOBAL
          setError({
            code: "Error",
            msg: "No se pudo cargar el producto.",
          });
        }
      };

      fetch();
    }
  }, [id]);

  // =====================
  // FORM
  // =====================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      const file = files[0];

      setForm({
        ...form,
        image: file,
        preview: URL.createObjectURL(file),
      });

      setMessage({
        type: "info",
        text: "Imagen cargada 🖼️",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 feedback previo
    setMessage({
      type: "waiting",
      text: isEdit ? "Actualizando producto..." : "Creando producto...",
    });

    try {
      const payload = {
        name: form.name,
        description: form.description,
        variants: [
          {
            name: "Porción",
            price: Number(form.price),
            stock: Number(form.stock),
          },
        ],
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        isPromo: form.isPromo,
        isActive: form.isActive,
        image: form.preview,
      };

      if (isEdit) {
        await updateProduct(id, payload);

        setMessage({
          type: "success",
          text: "Producto actualizado ✏️✨",
        });
      } else {
        await createProduct(payload);

        setMessage({
          type: "success",
          text: "Producto creado 🎉",
        });
      }

      navigate("/admin/products");
    } catch (err) {
      // ⚠️ error normal
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Error guardando producto ❌",
      });
    }
  };

  if (error) return <ErrorPage code={error.code} msg={error.msg} />;

  return (
    <div className="admin-product-form-container">
      <h2>{isEdit ? "Editar Producto" : "Crear Producto"}</h2>

      {isEdit && (
        <p className="product-dates">
          Creado: {dates.createdAt} | Última actualización:{" "}
          {dates.updatedAt}
        </p>
      )}

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Precio</label>
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label>Stock</label>
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <label>Tags (separados por coma)</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="vegetariano, picante..."
        />

        <label>
          <input
            type="checkbox"
            name="isPromo"
            checked={form.isPromo}
            onChange={handleChange}
          />
          Es promoción
        </label>

        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Producto activo
        </label>

        <label>Imagen</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {form.preview && (
          <img
            className="product-image-preview"
            src={form.preview}
            alt="Preview"
          />
        )}

        <button type="submit">
          {isEdit ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}