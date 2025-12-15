// pages/ml.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Cpu,
  TestTube,
  FlaskConical,
  Activity,
  CheckCircle2,
  AlertTriangle,
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

  /* ===============================
     FETCH PRODUITS
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
     PREDICTION
  =============================== */
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
      setResult({ error: "Erreur lors de l'analyse ML." });
    }

    setLoading(false);
  };

  /* ===============================
     HELPERS
  =============================== */
  const predictionBadge = (prediction) => {
    if (prediction === "risque") {
      return (
        <span className="badge badge-danger">
          <AlertTriangle size={14} /> À risque
        </span>
      );
    }
    return (
      <span className="badge badge-success">
        <CheckCircle2 size={14} /> Sûr
      </span>
    );
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="ml-header">
        <Cpu size={36} className="icon-animated" />
        <div>
          <h1 className="page-title">Prédiction ML</h1>
          <p className="page-subtitle">
            Analyse intelligente du risque de gaspillage alimentaire
          </p>
        </div>
      </div>

      {/* CARD PRINCIPALE */}
      <div className="card ml-card">
        {/* ÉTAPE 1 */}
        <div className="ml-step">
          <div className="ml-step-header">
            <TestTube size={20} />
            <h3>Sélection du produit</h3>
          </div>

          <div className="input-with-icon">
            <TestTube className="input-icon" size={18} />
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">Choisir un produit…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} • {p.days_left} jour
                  {p.days_left > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ÉTAPE 2 */}
        <div className="ml-step">
          <button
            onClick={handlePredict}
            disabled={!selectedId || loading}
            className="btn ml-btn"
          >
            {loading ? (
              <>
                <Loader /> Analyse en cours…
              </>
            ) : (
              <>
                <FlaskConical size={18} />
                Lancer l’analyse
              </>
            )}
          </button>
        </div>

        {/* RÉSULTAT */}
        {result && (
          <div className="ml-result">
            <div className="ml-result-header">
              <Activity size={20} />
              <h3>Résultat de l’analyse</h3>
            </div>

            {result.error ? (
              <p className="error-text">{result.error}</p>
            ) : (
              <div className="ml-result-content">
                <div className="ml-result-row">
                  <span>Produit</span>
                  <strong>{result.name}</strong>
                </div>

                <div className="ml-result-row">
                  <span>Jours restants</span>
                  <strong>{result.days_left}</strong>
                </div>

                <div className="ml-result-row">
                  <span>État prédit</span>
                  {predictionBadge(result.prediction)}
                </div>

                <div className="ml-message">
                  {result.message}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
