// pages/recipes.js
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  ChefHat,
  Sparkles,
  ExternalLink,
  UtensilsCrossed,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RecipesPage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [recipes, setRecipes] = useState([]);

  /* ===============================
     LOAD PRODUCTS
  =============================== */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]));
  }, [token]);

  /* ===============================
     LOAD RECIPES
  =============================== */
  useEffect(() => {
    if (!selectedProduct) return;

    setLoading(true);
    setRecipes([]);

    fetch(`${API_BASE}/external-data/${selectedProduct}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRecipes(data.recipes || []))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, [selectedProduct, token]);

  return (
    <div className="page">
      {/* HEADER */}
      <div className="recipes-header">
        <div>
          <h1 className="page-title">Recettes suggérées</h1>
          <p className="page-subtitle">
            Transformez vos produits en idées gourmandes.
          </p>
        </div>

        <ChefHat size={42} className="icon-soft" />
      </div>

      {/* SELECT PRODUIT */}
      <div className="card select-card">
        <label className="select-label">
          <UtensilsCrossed size={18} />
          Choisissez un produit
        </label>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Sélectionner un produit…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} • {p.days_left} jour{p.days_left > 1 ? "s" : ""} restant(s)
            </option>
          ))}
        </select>
      </div>

      {/* ÉTATS */}
      {loading && (
        <div className="info-card">
          <Sparkles size={18} />
          Recherche de recettes inspirantes…
        </div>
      )}

      {!loading && selectedProduct && recipes.length === 0 && (
        <div className="info-card">
          😕 Aucune recette trouvée pour ce produit.
        </div>
      )}

      {/* RECIPES GRID */}
      {!loading && recipes.length > 0 && (
        <div className="recipes-grid">
          {recipes.map((r) => (
            <div key={r.id} className="card recipe-card">
              <div className="recipe-image-wrapper">
                <img src={r.thumbnail} alt={r.title} />
              </div>

              <div className="recipe-content">
                <h3>{r.title}</h3>

                <a
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn recipe-btn"
                >
                  Voir la recette
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
