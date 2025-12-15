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
          <span className="badge">🌍 Agir contre le gaspillage alimentaire</span>

          <h1>
            Chaque aliment gaspillé<br />
            est une <span>ressource perdue</span>
          </h1>

          <p>
            FoodWaste Zero est une plateforme intelligente qui vous aide à
            anticiper, analyser et réduire le gaspillage alimentaire grâce
            à la data et à l’intelligence artificielle.
          </p>

          <div className="cta">
            <button
              className="btn-primary"
              onClick={() =>
                router.push(isAuthenticated ? "/dashboard" : "/register")
              }
            >
              Commencer maintenant
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
        <h2 className="animate">Une solution concrète et intelligente</h2>

        <div className="features-grid">
          <Feature
            icon={<Leaf size={34} />}
            title="Impact écologique"
            text="Réduisez votre empreinte environnementale au quotidien."
          />
          <Feature
            icon={<BellRing size={34} />}
            title="Alertes intelligentes"
            text="Anticipez la péremption avant qu’il ne soit trop tard."
          />
          <Feature
            icon={<Cpu size={34} />}
            title="Modèle prédictif"
            text="Analyse ML pour identifier les produits à risque."
          />
          <Feature
            icon={<BarChart3 size={34} />}
            title="Statistiques claires"
            text="Visualisez votre gaspillage réel et son évolution."
          />
          <Feature
            icon={<ShieldCheck size={34} />}
            title="Données sécurisées"
            text="Vos données restent privées et protégées."
          />
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="final-cta animate">
        <h2>
          Ensemble, faisons du <span>zéro gaspillage</span><br />
          une réalité.
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

        /* HERO */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 20px;
          background-image: url("https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2000");
          background-size: cover;
          background-position: center;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(0, 0, 0, 0.65),
            rgba(0, 0, 0, 0.75)
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
          line-height: 1.2;
          margin-bottom: 16px;
        }

        h1 span {
          color: #7fffd4;
        }

        p {
          font-size: 18px;
          opacity: 0.9;
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
          padding: 14px 26px;
          border-radius: 14px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid white;
          color: white;
          padding: 14px 26px;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        /* FEATURES */
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

        /* FINAL CTA */
        .final-cta {
          padding: 90px 20px;
          text-align: center;
          background: linear-gradient(135deg, #e0fff1, #ffffff);
        }

        .final-cta span {
          color: var(--primary);
        }

        /* ANIMATIONS — MOBILE FRIENDLY */
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

/* FEATURE COMPONENT */
function Feature({ icon, title, text }) {
  return (
    <div className="feature-card animate">
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
