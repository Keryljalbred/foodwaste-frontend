// pages/dashboard.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AlertTriangle, CheckCircle2, Clock, Package } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  
export default function DashboardPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // KPI States
  const [total, setTotal] = useState(0);
  const [expired, setExpired] = useState(0);
  const [risky, setRisky] = useState(0);
  const [safe, setSafe] = useState(0);

  // Fetch products
  useEffect(() => {
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
        console.error("Erreur fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProducts();
  }, [token]);

  // Recalculate KPIs
  useEffect(() => {
    if (!products || products.length === 0) {
      setTotal(0);
      setExpired(0);
      setRisky(0);
      setSafe(0);
      return;
    }

    const t = products.length;
    const e = products.filter((p) => p.days_left < 0).length;
    const r = products.filter((p) => p.days_left >= 0 && p.days_left <= 3).length;

    setTotal(t);
    setExpired(e);
    setRisky(r);
    setSafe(t - e - r);
  }, [products]);

  // Urgent products
  const urgentProducts = products
    .filter((p) => p.days_left <= 3)
    .sort((a, b) => a.days_left - b.days_left)
    .slice(0, 5);

  // Badge
  const riskBadge = (daysLeft) => {
    if (daysLeft < 0)
      return <span style={badgeStyle("#b91c1c", "#fee2e2")}>PÉRIMÉ</span>;
    if (daysLeft <= 1)
      return <span style={badgeStyle("#c05621", "#fff7ed")}>URGENT</span>;
    if (daysLeft <= 3)
      return <span style={badgeStyle("#d97706", "#fffbeb")}>À SURVEILLER</span>;
    return <span style={badgeStyle("#166534", "#dcfce7")}>OK</span>;
  };

  const badgeStyle = (color, bg) => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    color,
    backgroundColor: bg,
  });

  return (
    <>
      <h1 className="page-title">Tableau de bord</h1>
      <p className="page-subtitle">
        Vue d’ensemble de vos produits et des risques de gaspillage dans votre foyer.
      </p>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <KpiCard
          title="Produits totaux"
          value={total}
          icon={<Package size={22} color="#166534" />}
          bg="#ecfdf3"
        />
        <KpiCard
          title="Produits périmés"
          value={expired}
          icon={<AlertTriangle size={22} color="#b91c1c" />}
          bg="#fee2e2"
          valueColor="#b91c1c"
        />
        <KpiCard
          title="À risque (≤ 3 jours)"
          value={risky}
          icon={<Clock size={22} color="#c05621" />}
          bg="#fffbeb"
          valueColor="#c05621"
        />
        <KpiCard
          title="Produits en zone sûre"
          value={safe}
          icon={<CheckCircle2 size={22} color="#166534" />}
          bg="#ecfdf3"
          valueColor="#166534"
        />
      </div>

      {/* Deux colonnes */}
      <div className="dashboard-two-columns">
        {/* Liste des produits */}
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Liste des produits</h3>

          {loading ? (
            <p>Chargement...</p>
          ) : products.length === 0 ? (
            <p>Aucun produit pour l’instant.</p>
          ) : (
            <div className="table-wrapper">
              {/* 👇 NOUVEAU WRAPPER POUR LE SCROLL */}
              <div className="table-scroll-inner">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Catégorie</th>
                      <th>Quantité</th>
                      <th>Jours restants</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.category || "-"}</td>
                        <td style={{ textAlign: "center" }}>{p.quantity}</td>
                        <td style={{ textAlign: "center" }}>{p.days_left}</td>
                        <td>{riskBadge(p.days_left)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Priorités du moment */}
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>Priorités du moment</h3>

          {loading ? (
            <p>Analyse en cours...</p>
          ) : urgentProducts.length === 0 ? (
            <p>Aucun produit en risque immédiat.</p>
          ) : (
            <div className="priority-scroll">
              <div className="priority-inner">
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {urgentProducts.map((p) => (
                    <li
                      key={p.id}
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #edf2f7",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 14,
                      }}
                    >
                      <div>
                        <strong>{p.name}</strong>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {p.category || "Sans catégorie"}
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12 }}>
                          {p.days_left < 0
                            ? "Périmé"
                            : `${p.days_left} jour${p.days_left > 1 ? "s" : ""}`}
                        </div>
                        <div>{riskBadge(p.days_left)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* Reusable KPI Component */
function KpiCard({ title, value, icon, bg, valueColor }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div
            style={{
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              color: "#6b7280",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              marginTop: 4,
              color: valueColor || "#111827",
            }}
          >
            {value}
          </div>
        </div>
        <div
          style={{
            background: bg,
            borderRadius: 999,
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
