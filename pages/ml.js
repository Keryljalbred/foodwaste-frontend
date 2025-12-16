// pages/ml.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Cpu, TestTube, Activity, FlaskConical } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function MLPage() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     Chargement produits
  =============================== */
  useEffect(() => {
    if (!token) return;

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
      }
    };

    fetchProducts();
  }, [token]);

  /* ===============================
     Appel ML (DOM SAFE)
  =============================== */
  const handlePredict = async () => {
    if (!selectedId || loading) return; // 🔒 sécurité

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/products/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: selectedId }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Erreur lors de l'appel au modèle." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* TITRE */}
      <h1
        className="page-title"
        style={{ display: "flex", gap: 10, alignItems: "center" }}
      >
        <Cpu size={30} /> Prédiction ML
      </h1>

      <p className="page-subtitle">
        Analysez un produit via notre modèle de prédiction de gaspillage.
      </p>

      <div className="card" style={{ maxWidth: 650, margin: "0 auto" }}>
        {/* SELECT PRODUIT */}
        <label style={{ fontWeight: 600 }}>
          Produit à analyser
          <div className="input-with-icon">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Sélectionner un produit…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} • {p.days_left} jours restants
                </option>
              ))}
            </select>
          </div>
        </label>

        {/* BOUTON (DOM STABLE) */}
        <button
          onClick={handlePredict}
          disabled={!selectedId || loading}
          className="btn"
          style={{
            marginTop: 14,
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FlaskConical size={18} />
          {loading ? "Analyse en cours..." : "Analyser le produit"}
        </button>

        {/* ZONE RESULTAT (TOUJOURS PRÉSENTE) */}
        <div style={{ marginTop: 24 }}>
          {result ? (
            <div
              className="card"
              style={{
                background: "#F8FBFF",
                borderLeft: "4px solid var(--primary)",
              }}
            >
              <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={20} /> Résultat de l’analyse
              </h3>

              <pre
                style={{
                  background: "#fff",
                  padding: "12px 14px",
                  borderRadius: 10,
                  marginTop: 12,
                  fontSize: 13.5,
                  overflowX: "auto",
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ) : (
            <div
              style={{
                fontSize: 13,
                opacity: 0.5,
                textAlign: "center",
                padding: "12px 0",
              }}
            >
              Aucun résultat pour le moment
            </div>
          )}
        </div>
      </div>

      {/* Styles icône input */}
      <style jsx>{`
        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.55;
        }
        .input-with-icon select {
          padding-left: 36px !important;
        }
      `}</style>
    </div>
  );
}
