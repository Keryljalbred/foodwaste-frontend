// pages/products.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import {
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Utensils,
  Trash2,
  Filter,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ProductsPage() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===============================
     FETCH PRODUCTS
  =============================== */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  /* ===============================
     FETCH CATEGORIES
  =============================== */
  useEffect(() => {
    fetch(`${API_BASE}/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  /* ===============================
     ACTIONS
  =============================== */
  const actionCall = async (url) => {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: 1 }),
    });
    fetchProducts();
  };

  const consumeProduct = (id) =>
    actionCall(`${API_BASE}/products/${id}/consume`);
  const wasteProduct = (id) =>
    actionCall(`${API_BASE}/products/${id}/waste`);

  /* ===============================
     BADGES
  =============================== */
  const badge = (days) => {
    if (days < 0)
      return badgeStyle("Périmé", "#b91c1c", "#fee2e2", AlertTriangle);
    if (days <= 1)
      return badgeStyle("Urgent", "#c05621", "#fff7ed", Clock);
    if (days <= 3)
      return badgeStyle("À surveiller", "#d97706", "#fffbeb", Clock);
    return badgeStyle("OK", "#166534", "#dcfce7", CheckCircle2);
  };

  const badgeStyle = (text, color, bg, Icon) => (
    <span className="badge" style={{ background: bg, color }}>
      <Icon size={14} />
      {text}
    </span>
  );

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="page">
      {/* HEADER */}
      <div className="products-header">
        <div>
          <h1 className="page-title">Mes produits</h1>
          <p className="page-subtitle">
            Gérez vos aliments et réduisez le gaspillage au quotidien.
          </p>
        </div>

        <Link href="/add-product" className="btn">
          + Ajouter un produit
        </Link>
      </div>

      {/* FILTRE */}
      <div className="filter-bar">
        <Filter size={18} />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* CONTENU */}
      {loading ? (
        <p>Chargement…</p>
      ) : products.length === 0 ? (
        <div className="card empty-card">
          <Package size={42} />
          <p>Aucun produit pour l’instant.</p>
          <Link href="/add-product" className="btn">
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products
            .filter((p) =>
              selectedCategory ? p.category === selectedCategory : true
            )
            .map((p) => (
              <div key={p.id} className="card product-card">
                <div className="product-header">
                  <h3>{p.name}</h3>
                  <Package size={22} />
                </div>

                <div className="product-category">
                  {p.category || "Sans catégorie"}
                </div>

                <div className="product-info">
                  <span>
                    Quantité : <strong>{p.quantity}</strong>
                  </span>
                  <span className="days-left">
                    <Clock size={14} /> {p.days_left} j
                  </span>
                </div>

                <div className="product-badge">{badge(p.days_left)}</div>

                <div className="product-actions">
                  <button
                    className="btn"
                    onClick={() => consumeProduct(p.id)}
                  >
                    <Utensils size={16} /> Consommer
                  </button>

                  <button
                    className="btn danger"
                    onClick={() => wasteProduct(p.id)}
                  >
                    <Trash2 size={16} /> Gaspiller
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
