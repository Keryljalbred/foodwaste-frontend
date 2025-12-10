// pages/admin.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Users, Trash2, BarChart2, Package } from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function AdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Erreur admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  return (
    <div className="page">
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Users size={28} /> Administration
      </h1>

      <p className="page-subtitle">Supervision globale des utilisateurs et du gaspillage.</p>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Produits</th>
                <th>Consommés</th>
                <th>Gaspillés</th>
                <th>Taux gaspillage</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.full_name || u.email}</strong>
                    <br />
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{u.email}</span>
                  </td>

                  <td className="center">
                    <span className="badge blue">
                      <Package size={14} /> {u.product_count}
                    </span>
                  </td>

                  <td className="center">
                    <span className="badge green">{u.consumed}</span>
                  </td>

                  <td className="center">
                    <span className="badge red">{u.wasted}</span>
                  </td>

                  <td className="center">
                    <span className="badge orange">{u.waste_rate}%</span>
                  </td>

                  <td className="center">
                    <button className="btn-admin delete">
                      <Trash2 size={16} /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th {
          text-align: left;
          padding-bottom: 8px;
          font-weight: 600;
          color: #003b24;
        }

        td {
          padding: 10px 0;
          border-top: 1px solid #eee;
        }

        .center {
          text-align: center;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .green { background: #e7f9f0; color: #05a66b; }
        .red { background: #fdeaea; color: #e74c3c; }
        .blue { background: #e7f1ff; color: #3498db; }
        .orange { background: #fff4e1; color: #f39c12; }

        .btn-admin.delete {
          background: #e74c3c;
          color: white;
          padding: 6px 14px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
