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
import { BarChart2, PieChart as PieIcon, TrendingDown, TrendingUp, Layers,  Calendar, } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Statistics() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(

    new Date().toISOString().slice(0, 7)
  );

  const COLORS = ["#05A66B", "#E74C3C", "#3498DB"]; // Consommés, Gaspillés, Expirés

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/stats/overview?month=${month}`, {
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
  }, [token, month]);

  if (!stats) return <p>Chargement des statistiques...</p>;

  const pieData = [
    { name: "Consommés", value: stats.consumed },
    { name: "Gaspillés", value: stats.wasted },
    { name: "Expirés", value: stats.expired },
  ];

  return (
    <div className="page">
      <h1 className="page-title" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <BarChart2 size={28} /> Statistiques
      </h1>

      <p className="page-subtitle">Analyse avancée du gaspillage de votre foyer.</p>

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
        <div className="stats-card green">
          <Layers size={26} />
          <div>
            <h3>Total produits</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        <div className="stats-card blue">
          <TrendingUp size={26} />
          <div>
            <h3>Consommés</h3>
            <p>{stats.consumed}</p>
          </div>
        </div>

        <div className="stats-card red">
          <TrendingDown size={26} />
          <div>
            <h3>Gaspillés</h3>
            <p>{stats.wasted}</p>
          </div>
        </div>

        <div className="stats-card orange">
          <PieIcon size={26} />
          <div>
            <h3>Expirés</h3>
            <p>{stats.expired}</p>
          </div>
        </div>
      </div>

      {/* ======= PIE CHART ======= */}
      <div className="chart-block">
        <h2>
          <PieIcon size={22} /> Répartition des produits
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
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ======= BAR CHART ======= */}
      <div className="chart-block">
        <h2>
          <BarChart2 size={22} /> Taux de gaspillage (%)
        </h2>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={[{ name: "Gaspillage", value: stats.waste_rate }]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#E74C3C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
      {/* STYLES */}
      <style jsx>{`
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stats-card {
          background: white;
          padding: 18px;
          border-radius: 16px;
          display: flex;
          gap: 14px;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
          animation: fadeIn 0.4s ease;
        }

        .stats-card h3 {
          margin: 0;
          font-size: 15px;
          opacity: 0.75;
        }

        .stats-card p {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
        }

        .green {
          border-left: 5px solid var(--primary);
        }
        .red {
          border-left: 5px solid #e74c3c;
        }
        .blue {
          border-left: 5px solid #3498db;
        }
        .orange {
          border-left: 5px solid #f1c40f;
        }

        .chart-block {
          background: white;
          padding: 22px;
          margin-top: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
          animation: fadeIn 0.4s ease;
        }

        .chart-block h2 {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 16px;
          font-size: 18px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
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
