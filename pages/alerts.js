// pages/alerts.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AlertTriangle, Clock, XCircle, CheckCircle } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AlertsPage() {
  const { token } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error("Erreur :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [token]);

  return (
    <div className="page">
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AlertTriangle size={28} /> Alertes
      </h1>

      <p className="page-subtitle">
        Produits expirés ou proches de la date de péremption dans votre foyer.
      </p>

      {loading ? (
        <p>Chargement...</p>
      ) : alerts.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <CheckCircle size={42} color="#05A66B" />
          <p style={{ marginTop: 10, fontSize: 15 }}>Aucune alerte pour le moment.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((a, i) => (
            <div className="alert-card" key={i}>
              <div className="alert-header">
                {a.days_left < 0 ? (
                  <XCircle color="#E74C3C" size={24} />
                ) : (
                  <AlertTriangle color="#F39C12" size={24} />
                )}

                <strong>{a.name}</strong>
              </div>

              <div className="alert-info">
                <span className="badge category">{a.category || "Sans catégorie"}</span>

                <span
                  className={`badge ${
                    a.days_left < 0 ? "expired" : "warning"
                  }`}
                >
                  {a.days_left < 0
                    ? "Périmé"
                    : `${a.days_left} jours restants`}
                </span>
              </div>

              <p className="alert-message">{a.message}</p>

              <div className="alert-date">
                <Clock size={14} />
                Expire le :{" "}
                {new Date(a.expiration_date).toLocaleDateString("fr-FR")}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .alerts-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .alert-card {
          background: white;
          padding: 18px;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: fadeIn 0.3s ease;
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 600;
        }

        .alert-info {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .category {
          background: #e7f1ff;
          color: #3498db;
        }

        .warning {
          background: #fff4e1;
          color: #f39c12;
        }

        .expired {
          background: #fdeaea;
          color: #e74c3c;
        }

        .alert-message {
          font-size: 14px;
          opacity: 0.7;
        }

        .alert-date {
          font-size: 12px;
          opacity: 0.7;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
