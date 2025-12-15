// pages/index.js
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import {
  Leaf,
  ShieldCheck,
  BarChart3,
  BellRing,
  Cpu,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="overlay" />

        <div className="hero-content">
          <span className="badge">🌱 Plateforme intelligente anti-gaspillage</span>

          <h1>
            Réduisez le <span>gaspillage alimentaire</span><br />
            grâce à la <strong>data</strong> et à l’<strong>IA</strong>
          </h1>

          <p>
            FoodWaste Zero vous aide à suivre vos produits, anticiper les risques
            de péremption et adopter une consommation plus responsable,
            simplement et efficacement.
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
        <h2>Une solution complète, pensée pour votre foyer</h2>

        <div className="features-grid">
          <div className="feature-card">
            <Leaf size={36} />
            <h3>Suivi intelligent</h3>
            <p>
              Centralisez vos produits, visualisez leur état et évitez les pertes
              inutiles au quotidien.
            </p>
          </div>

          <div className="feature-card">
            <BellRing size={36} />
            <h3>Alertes prédictives</h3>
            <p>
              Notifications avant péremption et priorisation automatique des
              produits à consommer.
            </p>
          </div>

          <div className="feature-card">
            <Cpu size={36} />
            <h3>Modèle ML intégré</h3>
            <p>
              Un modèle de prédiction analyse le risque de gaspillage à partir
              de vos données.
            </p>
          </div>

          <div className="feature-card">
            <BarChart3 size={36} />
            <h3>Statistiques avancées</h3>
            <p>
              Visualisez votre impact, vos habitudes et votre taux de gaspillage
              réel.
            </p>
          </div>

          <div className="feature-card">
            <ShieldCheck size={36} />
            <h3>Données sécurisées</h3>
            <p>
              Vos données restent privées, chiffrées et strictement liées à votre
              foyer.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="final-cta">
        <h2>
          Reprenez le contrôle de votre alimentation,<br />
          dès aujourd’hui.
        </h2>

        <button
          className="btn-primary"
          onClick={() => router.push("/register")}
        >
          Créer mon compte gratuitement
        </button>
      </section>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .landing {
          animation: fadeIn 0.6s ease;
        }

        /* ---------- HERO ---------- */
        .hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          padding: 0 24px;
          background-image: url("https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=2000");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.65)
          );
        }

        .hero-content {
          position: relative;
          max-width: 720px;
          color: white;
          z-index: 1;
          animation: slideUp 0.8s ease;
        }

        .badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          margin-bottom: 18px;
        }

        h1 {
          font-size: 46px;
          line-height: 1.15;
          margin-bottom: 18px;
        }

        h1 span {
          color: #7fffd4;
        }

        p {
          font-size: 18px;
          opacity: 0.9;
          margin-bottom: 30px;
          max-width: 600px;
        }

        .cta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          border: none;
          padding: 14px 26px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
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

        .btn-secondary:hover {
          background: white;
          color: #111;
        }

        /* ---------- FEATURES ---------- */
        .features {
          padding: 80px 24px;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .features h2 {
          font-size: 30px;
          margin-bottom: 40px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .feature-card {
          background: white;
          padding: 28px 24px;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: transform 0.25s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
        }

        .feature-card h3 {
          margin-top: 14px;
          margin-bottom: 8px;
        }

        .feature-card p {
          font-size: 14px;
          opacity: 0.8;
        }

        /* ---------- FINAL CTA ---------- */
        .final-cta {
          padding: 90px 24px;
          text-align: center;
          background: linear-gradient(135deg, #e0fff1, #ffffff);
        }

        .final-cta h2 {
          font-size: 32px;
          margin-bottom: 28px;
        }

        /* ---------- ANIMATIONS ---------- */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
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
            font-size: 34px;
          }

          p {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
