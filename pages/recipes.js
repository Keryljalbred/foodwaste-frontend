// pages/recipes.js
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
export default function RecipesPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [recipes, setRecipes] = useState([]);

  // Charger les produits
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, [token]);

  // Quand un produit est sélectionné → appeler API external-data
  useEffect(() => {
    if (!selectedProduct) return;

    setLoading(true);

    fetch(`${API_BASE}/external-data/${selectedProduct}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes || []);
      })
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [selectedProduct]);

  return (
    <>
      <h1 className="page-title">Recettes suggérées</h1>
      <p className="page-subtitle">
        Choisissez un produit pour obtenir des idées de recettes liées.
      </p>

      {/* Dropdown produit */}
      <div style={{ maxWidth: 350, marginBottom: 20 }}>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        >
          <option value="">Sélectionner un produit…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.days_left} j restants
            </option>
          ))}
        </select>
      </div>

      {/* Contenu */}
      {loading && <p>Chargement des recettes…</p>}

      {!loading && selectedProduct && recipes.length === 0 && (
        <p style={{ marginTop: 20 }}>Aucune recette trouvée pour ce produit.</p>
      )}

      {!loading && recipes.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {recipes.map((r) => (
            <div
              key={r.id}
              className="card"
              style={{
                padding: 18,
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <img
                src={r.thumbnail}
                alt={r.title}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />

              <h3 style={{ margin: 0 }}>{r.title}</h3>

              <a
                href={r.link}
                target="_blank"
                className="btn"
                style={{ textAlign: "center" }}
              >
                Voir la recette →
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
