// pages/ml.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FlaskConical,
  Cpu,
  TestTube,
  Activity,
} from "lucide-react";
import Loader from "../components/Loader";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function MLPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🟦 Récupération des produits utilisateur
  useEffect(() => {
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
    if (token) fetchProducts();
  }, [token]);

  // 🟩 Appel du modèle ML
  const handlePredict = async () => {
    if (!selectedId) return;

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
    }

    setLoading(false);
  };

  return (
    <div className="page">
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
        {/* Sélecteur de produit */}
        <label style={{ fontWeight: 600 }}>
          Produit à analyser
          <div className="input-with-icon">
            <TestTube className="input-icon" size={18} />
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

        {/* 🟧 Bouton prédiction */}
        <button
          onClick={handlePredict}
          disabled={!selectedId || loading}
          className="btn"
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 15,
          }}
        >
          {loading ? <Loader /> : <FlaskConical size={18} />}
          Analyser le produit
        </button>

        {/* 🟪 Résultat */}
        {result && (
          <div
            className="card"
            style={{
              marginTop: 24,
              background: "#F8FBFF",
              borderLeft: "4px solid var(--primary)",
              animation: "fadeIn 0.35s ease",
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
        )}
      </div>

      {/* Styles */}
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

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
