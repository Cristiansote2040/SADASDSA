import { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";
import "../Styles/AdminDashboard.css";
import { getOrders } from "../services/orderService";
import { getUsers } from "../services/userService";
import { getProducts } from "../services/productService";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const o = await getOrders();
    const u = await getUsers();
    const p = await getProducts();

    setOrders(Array.isArray(o) ? o.data : o?.data || []);
    setUsers(Array.isArray(u) ? u.data : u?.data || []);
    setProducts(Array.isArray(p) ? p.data.products : p?.data.products || []);
  };

  // 🔥 FILTRO
  const getDays = () => {
    if (range === "today") return 1;
    if (range === "30d") return 30;
    if (range === "90d") return 90;
    if (range === "1y") return 365;
  };

  const filter = (data) => {
    const days = getDays();
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - days);

    return data.filter((i) => {
      if (!i?.createdAt) return false;
      const d = new Date(i.createdAt);
      return d >= past && d <= now;
    });
  };

  const fOrders = filter(orders);
  const fUsers = filter(users);
  const fProducts = filter(products);

  // 💰 MÉTRICAS
  const totalSales = fOrders.reduce((a, o) => a + (o.totalPrice || 0), 0);

  // 📈 VENTAS POR DÍA
  const salesChart = useMemo(() => {
    const map = {};

    fOrders.forEach((o) => {
      const d = new Date(o.createdAt).toLocaleDateString();
      map[d] = (map[d] || 0) + (o.totalPrice || 0);
    });

    const sorted = Object.entries(map).sort(
      (a, b) => new Date(a[0]) - new Date(b[0])
    );

    return {
      categories: sorted.map((e) => e[0]),
      data: sorted.map((e) => e[1]),
    };
  }, [fOrders]);

  // 👤 USUARIOS
  const usersChart = useMemo(() => {
    const map = {};

    fUsers.forEach((u) => {
      const d = new Date(u.createdAt).toLocaleDateString();
      map[d] = (map[d] || 0) + 1;
    });

    return {
      categories: Object.keys(map),
      data: Object.values(map),
    };
  }, [fUsers]);

  // 🥧 TOP PRODUCTOS
  const pieData = useMemo(() => {
    const map = {};

    fOrders.forEach((o) => {
      o.items?.forEach((i) => {
        map[i.name] = (map[i.name] || 0) + i.quantity;
      });
    });

    const entries = Object.entries(map).slice(0, 5);

    return {
      labels: entries.map((e) => e[0]),
      series: entries.map((e) => e[1]),
    };
  }, [fOrders]);

  // 📊 OPCIONES DARK (CLAVE 🔥)
  const darkOptions = {
    theme: { mode: "dark" },
    chart: { background: "transparent" },
    grid: { borderColor: "#334155" },
    xaxis: { labels: { style: { colors: "#cbd5f5" } } },
    yaxis: { labels: { style: { colors: "#cbd5f5" } } },
  };

  return (
    <div className="dashboard">
      <h1>🚀 Dashboard PRO</h1>

      {/* FILTROS */}
      <div className="filters">
        {["today", "30d", "90d", "1y"].map((r) => (
          <button
            key={r}
            className={range === r ? "active" : ""}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Ventas</h3>
          <p>${totalSales.toLocaleString()}</p>
        </div>

        <div className="card">
          <h3>Pedidos</h3>
          <p>{fOrders.length}</p>
        </div>

        <div className="card">
          <h3>Usuarios</h3>
          <p>{fUsers.length}</p>
        </div>

        <div className="card">
          <h3>Productos</h3>
          <p>{fProducts.length}</p>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="charts">

        {/* VENTAS */}
        <div className="chart-box">
          <h2>Ventas</h2>
          {salesChart.data.length === 0 ? (
            <p>No hay datos</p>
          ) : (
            <Chart
              options={{ ...darkOptions, xaxis: { categories: salesChart.categories } }}
              series={[{ data: salesChart.data }]}
              type="area"
              height={250}
            />
          )}
        </div>

        {/* USUARIOS */}
        <div className="chart-box">
          <h2>Usuarios</h2>
          <Chart
            options={{ ...darkOptions, xaxis: { categories: usersChart.categories } }}
            series={[{ data: usersChart.data || [] }]}
            type="bar"
            height={250}
          />
        </div>

        {/* TORTA */}
        <div className="chart-box">
          <h2>Top Productos</h2>
          <Chart
            options={{ ...darkOptions, labels: pieData.labels || [] }}
            series={pieData.series || []}
            type="pie"
            height={250}
          />
        </div>

      </div>
    </div>
  );
}