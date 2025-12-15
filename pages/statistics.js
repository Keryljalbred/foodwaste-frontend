// pages/statistics.js
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart2,
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  Layers,
  Activity,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function StatisticsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const COLORS = ["#05A66B", "#E74C3C", "#3498DB"]; // consommés, gaspillés, expirés

  /* ===============================
     FETCH STATS
  =============================== */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/stats/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("Impossible de charger les statistiques.");
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch {
        setError("Erreur réseau.");
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (!stats) {
    return <p>Chargement des statistiques…</p>;
  }

  const pieData = [
    { name: "Consommés", value: stats.consumed },
    { name: "Gaspillés", value: stats.wasted },
    { name: "Expirés", value: stats.expired },
  ];

  return (
    <div className="page">
      {/* HEADER */}
      <div className="stats-header">
        <div>
          <h1 className="page-title">Statistiques</h1>
          <p className="page-subtitle">
            Analyse détaillée de la consommation et du gaspillage de votre foyer.
          </p>
        </div>
        <Activity size={42} className="icon-soft" />
      </div>

      {error && <p className="error-text">{error}</p>}

      {/* KPI CARDS */}
      <div className="stats-cards">
        <StatCard
          title="Produits totaux"
          value={stats.total}
          icon={<Layers />}
          color="green"
        />
        <StatCard
          title="Consommés"
          value={stats.consumed}
          icon={<TrendingUp />}
          color="blue"
        />
        <StatCard
          title="Gaspillés"
          value={stats.wasted}
          icon={<TrendingDown />}
          color="red"
        />
        <StatCard
          title="Expirés"
          value={stats.expired}
          icon={<PieIcon />}
          color="orange"
        />
      </div>

      {/* PIE */}
      <div className="card chart-card">
        <h2>
          <PieIcon size={20} /> Répartition des produits
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              labelLine={false}
              label={({ name, value }) => `${name} : ${value}`}
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR */}
      <div className="card chart-card">
        <h2>
          <BarChart2 size={20} /> Taux de gaspillage (%)
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={[
              {
                name: "Gaspillage",
                value: stats.waste_rate,
              },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#E74C3C" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ===============================
   COMPONENTS
=============================== */
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`card stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <span className="stat-title">{title}</span>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}
