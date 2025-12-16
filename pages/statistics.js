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
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import {
  BarChart2,
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  Layers,
  Calendar,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Statistics() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // 📆 mois sélectionné (YYYY-MM)
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const COLORS = ["#05A66B", "#E74C3C", "#3498DB"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/stats/overview?month=${month}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
  }, [token, month]);

  if (!stats) return <p>Chargement des statistiques...</p>;

  const pieData = [
    { name: "Consommés", value: stats.consumed },
    { name: "Gaspillés", value: stats.wasted },
    { name: "Expirés", value: stats.expired },
  ];

  return (
    <div className="page">
      <h1 className="page-title" style={{ display: "flex", gap: 10 }}>
        <BarChart2 size={28} /> Statistiques
      </h1>

      <p className="page-subtitle">
        Analyse mensuelle et tendances de consommation de votre foyer.
      </p>

      {/* 📆 FILTRE MOIS */}
      <div
        style={{
          maxWidth: 240,
          marginBottom: 24,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Calendar size={18} />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ======= CARDS ======= */}
      <div className="stats-cards">
        <StatCard title="Total produits" value={stats.total} icon={<Layers />} />
        <StatCard
          title="Consommés"
          value={stats.consumed}
          icon={<TrendingUp />}
          color="green"
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

      {/* ======= PIE ======= */}
      <ChartBlock title="Répartition des produits" icon={<PieIcon />}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartBlock>

      {/* ======= TREND LINE ======= */}
      {stats.daily_trend && (
        <ChartBlock title="Tendance de consommation" icon={<TrendingUp />}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.daily_trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="consumed"
                stroke="#05A66B"
                strokeWidth={3}
                name="Consommés"
              />
              <Line
                type="monotone"
                dataKey="wasted"
                stroke="#E74C3C"
                strokeWidth={3}
                name="Gaspillés"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartBlock>
      )}
    </div>
  );
}

/* ===== COMPONENTS ===== */

function StatCard({ title, value, icon }) {
  return (
    <div className="stats-card">
      {icon}
      <div>
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
}

function ChartBlock({ title, icon, children }) {
  return (
    <div className="chart-block">
      <h2 style={{ display: "flex", gap: 8 }}>
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}
