// pages/index.js
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import {
  Leaf,
  BellRing,
  BarChart3,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">

      {/* ================= HERO FULL PAGE ================= */}
      <section className="hero">
        <div className="overlay" />

        <div className="hero-content animate">
          <span className="badge">♻️ Le gaspillage alimentaire est un vrai problème</span>

          <h1>
            Des tonnes d’aliments<br />
            <span>finissent à la poubelle</span>
          </h1>

          <p>
            FoodWaste Zero aide les foyers à identifier, anticiper et réduire
            le gaspillage alimentaire grâce à la data et à l’intelligence artificielle.
          </p>

          <div className="cta">
            <button
              className="btn-primary"
              onClick={() =>
                router.push(isAuthenticated ? "/dashboard" : "/register")
              }
            >
              Agir maintenant
            </button>

            {!isAuthenticated && (
              <button
                className="btn-secondary"
                onClick={() => router.push("/login")}
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features">
        <h2 className="animate">Transformer un problème réel en solution intelligente</h2>

        <div className="features-grid">
          <Feature
            icon={<Leaf size={34} />}
            title="Réduction du gaspillage"
            text="Identifiez les produits à consommer en priorité."
          />
          <Feature
            icon={<BellRing size={34} />}
            title="Alertes prédictives"
            text="Anticipez la péremption avant qu’il ne soit trop tard."
          />
          <Feature
            icon={<Cpu size={34} />}
            title="Modèle intelligent"
            text="Analyse basée sur les données et règles prédictives."
          />
          <Feature
            icon={<BarChart3 size={34} />}
            title="Impact mesurable"
            text="Visualisez votre gaspillage et son évolution."
          />
          <Feature
            icon={<ShieldCheck size={34} />}
            title="Données protégées"
            text="Vos données restent strictement privées."
          />
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="final-cta animate">
        <h2>
          Chaque produit sauvé<br />
          est une <span>victoire contre le gaspillage</span>
        </h2>

        <button
          className="btn-primary"
          onClick={() => router.push("/register")}
        >
          Créer un compte gratuitement
        </button>
      </section>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .landing {
          overflow-x: hidden;
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 20px;
          background-image: url("https://images.unsplash.com/photo-1590080877777-5c2d7d63f0c9?q=80&w=2000");
          background-size: cover;
          background-position: center;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(0, 0, 0, 0.7),
            rgba(0, 60, 40, 0.75)
          );
        }

        .hero-content {
          position: relative;
          max-width: 760px;
          color: white;
          z-index: 1;
        }

        .badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        h1 {
          font-size: 44px;
          line-height: 1.15;
          margin-bottom: 16px;
        }

        h1 span {
          color: #7fffd4;
        }

        p {
          font-size: 18px;
          opacity: 0.92;
          margin-bottom: 30px;
          max-width: 620px;
        }

        .cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          padding: 14px 28px;
          border-radius: 14px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid white;
          color: white;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .features {
          padding: 80px 20px;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .feature-card {
          background: white;
          padding: 26px;
          border-radius: 18px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
        }

        .final-cta {
          padding: 90px 20px;
          text-align: center;
          background: linear-gradient(135deg, #e0fff1, #ffffff);
        }

        .final-cta span {
          color: var(--primary);
        }

        .animate {
          animation: fadeUp 0.8s ease both;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 32px;
          }

          p {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card animate">
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
