// pages/dashboard.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function DashboardPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // KPI states
  const [total, setTotal] = useState(0);
  const [expired, setExpired] = useState(0);
  const [risky, setRisky] = useState(0);
  const [safe, setSafe] = useState(0);

  /* ===============================
     FETCH PRODUCTS
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  /* ===============================
     KPI CALCUL
  =============================== */
  useEffect(() => {
    if (!products.length) {
      setTotal(0);
      setExpired(0);
      setRisky(0);
      setSafe(0);
      return;
    }

    const t = products.length;
    const e = products.filter((p) => p.days_left < 0).length;
    const r = products.filter(
      (p) => p.days_left >= 0 && p.days_left <= 3
    ).length;

    setTotal(t);
    setExpired(e);
    setRisky(r);
    setSafe(t - e - r);
  }, [products]);

  /* ===============================
     URGENT PRODUCTS
  =============================== */
  const urgentProducts = products
    .filter((p) => p.days_left <= 3)
    .sort((a, b) => a.days_left - b.days_left)
    .slice(0, 5);

  /* ===============================
     BADGE
  =============================== */
  const badge = (days) => {
    if (days < 0)
      return <span className="badge badge-danger">Périmé</span>;
    if (days <= 1)
      return <span className="badge badge-urgent">Urgent</span>;
    if (days <= 3)
      return <span className="badge badge-warning">À surveiller</span>;
    return <span className="badge badge-ok">OK</span>;
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="dashboard-hero">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">
          Suivez en temps réel l’état de vos produits et anticipez le gaspillage.
        </p>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <Kpi
          title="Produits totaux"
          value={total}
          icon={<Package size={22} />}
          color="green"
        />
        <Kpi
          title="Produits périmés"
          value={expired}
          icon={<AlertTriangle size={22} />}
          color="red"
        />
        <Kpi
          title="À risque"
          value={risky}
          icon={<Clock size={22} />}
          color="orange"
        />
        <Kpi
          title="Zone sûre"
          value={safe}
          icon={<CheckCircle2 size={22} />}
          color="green"
        />
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-two-columns">
        {/* TABLE */}
        <div className="card">
          <h3 className="card-title">Produits enregistrés</h3>

          {loading ? (
            <p>Chargement…</p>
          ) : products.length === 0 ? (
            <p>Aucun produit enregistré.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Qté</th>
                    <th>Jours</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.category || "-"}</td>
                      <td>{p.quantity}</td>
                      <td>{p.days_left}</td>
                      <td>{badge(p.days_left)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PRIORITÉS */}
        <div className="card">
          <h3 className="card-title">Priorités du moment</h3>

          {loading ? (
            <p>Analyse en cours…</p>
          ) : urgentProducts.length === 0 ? (
            <p>Aucune urgence détectée 🎉</p>
          ) : (
            <ul className="priority-list">
              {urgentProducts.map((p) => (
                <li key={p.id} className="priority-item">
                  <div>
                    <strong>{p.name}</strong>
                    <div className="priority-meta">
                      {p.category || "Sans catégorie"}
                    </div>
                  </div>
                  <div className="priority-right">
                    <span>
                      {p.days_left < 0
                        ? "Périmé"
                        : `${p.days_left} jour${
                            p.days_left > 1 ? "s" : ""
                          }`}
                    </span>
                    {badge(p.days_left)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   KPI COMPONENT
=============================== */
function Kpi({ title, value, icon, color }) {
  return (
    <div className="card kpi-card">
      <div className="kpi-left">
        <span className="kpi-title">{title}</span>
        <span className={`kpi-value ${color}`}>{value}</span>
      </div>
      <div className={`kpi-icon ${color}`}>{icon}</div>
    </div>
  );
}
