// pages/index.js
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import Image from "next/image";
import { Leaf, ShieldCheck, BarChart3, BellRing } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Réduisez le gaspillage <span className="highlight">facilement</span>.
          </h1>
          <p>
            FoodWaste Zero vous aide à suivre vos produits, prédire les risques,
            recevoir des alertes et analyser votre consommation.
          </p>

          <div className="cta-buttons">
            <button className="btn-start" onClick={() => router.push(isAuthenticated ? "/dashboard" : "/register")}>
              Commencer maintenant
            </button>
            <button className="btn-outline" onClick={() => router.push("/login")}>
              Se connecter
            </button>
          </div>
        </div>

        <div className="hero-image">
          <Image
            src="https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?q=80&w=1200"
            width={500}
            height={380}
            alt="Dashboard Preview"
            className="img"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Une expérience complète, conçue pour vous.</h2>

        <div className="feature-grid">

          <div className="feature-card animate">
            <Leaf size={38} color="#05A66B" />
            <h3>Suivi intelligent</h3>
            <p>Ajoutez vos produits, surveillez leur durée de vie et recevez des alertes automatiques.</p>
          </div>

          <div className="feature-card animate">
            <BellRing size={38} color="#F39C12" />
            <h3>Alertes intelligentes</h3>
            <p>Notification avant péremption + risques identifiés grâce à nos règles intelligentes.</p>
          </div>

          <div className="feature-card animate">
            <BarChart3 size={38} color="#3498DB" />
            <h3>Statistiques avancées</h3>
            <p>Analyse de votre impact, gaspillage évité, tendances du frigo, et plus encore.</p>
          </div>

          <div className="feature-card animate">
            <ShieldCheck size={38} color="#5A3DF1" />
            <h3>Sécurité & confidentialité</h3>
            <p>Vos données sont chiffrées et restent strictement privées à votre foyer.</p>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="final-cta">
        <h2>Prêt(e) à reprendre le contrôle de votre alimentation ?</h2>
        <button className="btn-start" onClick={() => router.push("/register")}>
          Créer mon compte
        </button>
      </section>

      <style jsx>{`
        .landing {
          padding-bottom: 80px;
          animation: fadeIn 0.4s ease;
        }

        .hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 60px 0;
          gap: 40px;
          flex-wrap: wrap;
        }

        .hero-content {
          max-width: 550px;
        }

        h1 {
          font-size: 46px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .highlight {
          color: var(--primary);
        }

        p {
          font-size: 17px;
          opacity: 0.8;
          margin-bottom: 28px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
        }

        .btn-start {
          background: var(--primary);
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-start:hover {
          background: var(--primary-dark);
        }

        .btn-outline {
          padding: 12px 24px;
          border-radius: 12px;
          border: 2px solid var(--primary);
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .btn-outline:hover {
          background: var(--primary);
          color: white;
        }

        .hero-image .img {
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        /* Features */
        .features {
          margin-top: 60px;
          text-align: center;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-top: 40px;
        }

        .feature-card {
          background: white;
          padding: 26px;
          border-radius: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.07);
          transition: transform 0.25s ease;
        }

        .feature-card:hover {
          transform: translateY(-6px);
        }

        .final-cta {
          text-align: center;
          margin-top: 80px;
          padding: 50px 0;
          background: linear-gradient(135deg, #E0FFF1, white);
          border-radius: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; translate: 0 10px; }
          to { opacity: 1; translate: 0 0; }
        }
      `}</style>
    </div>
  );
}
