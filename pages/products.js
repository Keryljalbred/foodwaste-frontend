// pages/products.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";

import {
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Utensils,
  Trash2,
} from "lucide-react";
const router = useRouter();

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
export const ssr = false;


export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      } else {
        console.error("Error products", await res.text());
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

  useEffect(() => {
    fetch(`${API_BASE}/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // ----- ACTIONS -----
  const actionCall = async (url) => {
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: 1 }),
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const consumeProduct = (id) =>
    actionCall(`${API_BASE}/products/${id}/consume`);

  const wasteProduct = (id) =>
    actionCall(`${API_BASE}/products/${id}/waste`);

  // ----- BADGE -----
  const badge = (days) => {
    if (days < 0)
      return badgeStyle("PÉRIMÉ", "#b91c1c", "#fee2e2", AlertTriangle);
    if (days <= 1)
      return badgeStyle("URGENT", "#c05621", "#fff7ed", Clock);
    if (days <= 3)
      return badgeStyle("À SURVEILLER", "#d97706", "#fffbeb", Clock);
    return badgeStyle("OK", "#166534", "#dcfce7", CheckCircle2);
  };

  const badgeStyle = (text, color, bg, Icon) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: bg,
        color,
      }}
    >
      <Icon size={13} />
      {text}
    </span>
  );

  return (
    <>
      <h1 className="page-title">Mes produits</h1>

      {/* FILTRE CATÉGORIES */}
      <div style={{ maxWidth: 300, marginBottom: 20 }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <p className="page-subtitle">
        Gérez vos produits : consommer, gaspiller et suivre leur état.
      </p>

      <p className="page-subtitle">
        Ajouter un Produit{" "}
        <span onClick={() => router.push("/add-product")} style={{ color: "var(--primary)", cursor: "pointer" }}>
          Ajouter
        </span>

      </p>

      {loading ? (
        <p>Chargement…</p>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 30 }}>
          <Package size={40} color="#6b7280" />
          <p style={{ marginTop: 12 }}>
            Aucun produit.{" "}
            <span onClick={() => router.push("/add-product")} style={{ color: "var(--primary)", cursor: "pointer" }}>
              Ajouter
            </span>

          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {products
            .filter((p) =>
              selectedCategory === "" ? true : p.category === selectedCategory
            )
            .map((p) => (
              <div
                key={p.id}
                className="card"
                style={{
                  padding: 20,
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  animation: "fadeInCard 0.4s ease",
                }}
              >
                {/* Nom + catégorie */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{p.name}</h3>
                    <Package size={22} color="#4b5563" />
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.7 }}>
                    {p.category ?? "Sans catégorie"}
                  </div>
                </div>

                {/* Quantité + jours */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    marginTop: 15,
                  }}
                >
                  <span>
                    Quantité : <strong>{p.quantity}</strong>
                  </span>
                  <span
                    style={{ display: "flex", gap: 4, alignItems: "center" }}
                  >
                    <Clock size={15} /> {p.days_left} j
                  </span>
                </div>

                {/* Badge */}
                <div style={{ marginTop: 10 }}>{badge(p.days_left)}</div>

                {/* Boutons */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 16,
                  }}
                >
                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                    onClick={() => consumeProduct(p.id)}
                  >
                    <Utensils size={16} /> Consommer
                  </button>

                  <button
                    className="btn"
                    style={{
                      flex: 1,
                      backgroundColor: "#b91c1c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                    onClick={() => wasteProduct(p.id)}
                  >
                    <Trash2 size={16} /> Gaspiller
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
