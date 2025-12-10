// pages/history.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function HistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        console.error("Erreur backend :", await res.text());
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const formatDate = (d) =>
    new Date(d).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="page">
      <h1 className="page-title">Historique</h1>
      <p className="page-subtitle">
        Suivez l’évolution de vos actions : consommation et gaspillage.
      </p>

      {loading ? (
        <p>Chargement...</p>
      ) : history.length === 0 ? (
        <p>Aucune action pour le moment.</p>
      ) : (
        <div className="timeline">
          {history.map((h, i) => (
            <div className="timeline-item" key={h.id || i}>
              <div className="timeline-dot"></div>

              <div className="timeline-content">
                <div className="timeline-header">
                  {h.action === "consumed" ? (
                    <CheckCircle color="#05A66B" size={20} />
                  ) : (
                    <XCircle color="#E74C3C" size={20} />
                  )}

                  <strong style={{ marginLeft: 8 }}>
                    {h.action === "consumed" ? "Consommé" : "Gaspillé"}
                  </strong>
                </div>

                <p className="timeline-text">
                  <b>{h.product_name || "Produit supprimé"}</b>  
                  — quantité : {h.amount}
                </p>

                <div className="timeline-date">
                  <Clock size={14} />
                  {formatDate(h.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styles internes */}
      <style jsx>{`
        .timeline {
          margin-top: 24px;
          border-left: 3px solid #dfeee8;
          padding-left: 20px;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 24px;
          animation: fadeIn 0.4s ease;
        }

        .timeline-dot {
          width: 14px;
          height: 14px;
          background: var(--primary);
          border-radius: 50%;
          position: absolute;
          left: -29px;
          top: 5px;
        }

        .timeline-content {
          background: white;
          padding: 14px 18px;
          border-radius: 12px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
        }

        .timeline-header {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          font-size: 15px;
          font-weight: 600;
        }

        .timeline-text {
          font-size: 14px;
          margin: 4px 0;
        }

        .timeline-date {
          font-size: 12px;
          opacity: 0.6;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
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
      `}</style>
    </div>
  );
}
