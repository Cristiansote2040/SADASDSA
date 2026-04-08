import "../Styles/Components/CategoriesSection.css";
import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CategoriesMinimalFinal() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      let retries = 3;

      while (retries > 0) {
        try {
          const res = await getCategories();
          setCategories(res.data);
          return; // si funciona, salimos
        } catch (error) {
          retries--;
          console.log("Retry... quedan:", retries);
          await new Promise((r) => setTimeout(r, 3000));
        }
      }

      console.error("Error final al traer categorías");
    };

    fetchCategories().finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loadingText">Cargando categorías…</p>;

  return (
    <motion.section
      className="minimalCategoriesContainerFinal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="minimalTitleFinal">Estas son nuestras categorías</h2>
      <p className="minimalDescFinal">
        Descubrí todos nuestros productos organizados por categorías. Hacé clic
        en la que más te interese para explorar los productos.
      </p>

      <div className="minimalListFinal">
        {categories.map((cat, i) => (
          <motion.div
            key={cat._id}
            className="minimalItemFinal"
            onClick={() =>
              navigate(`/products?category=${encodeURIComponent(cat._id)}`)
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{
              scale: 1.06,
              boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
              y: -3,
            }}
          >
            <div
              className="minimalImgFinal"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <h3 className="minimalNameFinal">{cat.name}</h3>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
