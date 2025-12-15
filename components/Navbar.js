import { useState } from "react";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="navbar-pro">
        <div className="nav-left">
          <div className="brand">Zéro gaspillage alimentaire</div>

          <div className="nav-links">
            <span className="nav-item">Tableau de bord</span>
            <span className="nav-item">Produits</span>
            <span className="nav-item">Recettes</span>
            <span className="nav-item">Prédiction</span>
            <span className="nav-item">Statistiques</span>
            <span className="nav-item">Paramètres</span>
          </div>
        </div>

        <div className="nav-right">
          {/* 🔴 HAMBURGER — C’EST LUI */}
          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu />
          </button>

          <span className="user-label">Cindy</span>
          <button className="logout-btn">⎋</button>
        </div>
      </div>

      {/* =======================
          MENU MOBILE
      ======================= */}
      {open && (
        <div className="mobile-menu">
          <span className="mobile-item" onClick={() => setOpen(false)}>
            Tableau de bord
          </span>
          <span className="mobile-item" onClick={() => setOpen(false)}>
            Produits
          </span>
          <span className="mobile-item" onClick={() => setOpen(false)}>
            Recettes
          </span>
          <span className="mobile-item" onClick={() => setOpen(false)}>
            Prédiction
          </span>
          <span className="mobile-item" onClick={() => setOpen(false)}>
            Statistiques
          </span>
          <span className="mobile-item logout-mobile" onClick={() => setOpen(false)}>
            Déconnexion
          </span>
        </div>
      )}
    </>
  );
}
