// pages/donate.js
import { Heart, HandHeart, Gift } from "lucide-react";

export default function DonatePage() {
  return (
    <div className="page donate-page">
      {/* HERO */}
      <div className="donate-hero">
        <h1 className="page-title">Faire un don alimentaire</h1>
        <p className="page-subtitle">
          Un geste simple peut faire une grande différence.
          Donnez une seconde vie à vos produits encore consommables.
        </p>
      </div>

      {/* CONTENT */}
      <div className="donate-grid">
        {/* CARD 1 */}
        <DonateCard
          title="Banques Alimentaires"
          description="Un réseau national qui collecte et redistribue des denrées alimentaires aux associations locales."
          icon={<Gift size={28} />}
          action={() =>
            window.open("https://www.banquealimentaire.org", "_blank")
          }
          color="green"
        />

        {/* CARD 2 */}
        <DonateCard
          title="Restos du Cœur"
          description="Aide alimentaire et accompagnement des personnes en situation de précarité partout en France."
          icon={<Heart size={28} />}
          action={() =>
            window.open("https://www.restosducoeur.org", "_blank")
          }
          color="red"
        />

        {/* CARD 3 */}
        <DonateCard
          title="Too Good To Go"
          description="Une plateforme engagée contre le gaspillage alimentaire, en lien avec les commerces locaux."
          icon={<HandHeart size={28} />}
          action={() =>
            window.open("https://www.toogoodtogo.com/fr", "_blank")
          }
          color="orange"
        />
      </div>

      {/* FOOTNOTE */}
      <p className="donate-footnote">
        FoodWaste Zero agit comme facilitateur et ne gère pas directement
        la logistique des dons.
      </p>
    </div>
  );
}

/* ===============================
   DONATE CARD
=============================== */
function DonateCard({ title, description, icon, action, color }) {
  return (
    <div className={`card donate-card ${color}`}>
      <div className="donate-icon">{icon}</div>

      <h3>{title}</h3>
      <p>{description}</p>

      <button className="btn donate-btn" onClick={action}>
        Faire un don
      </button>
    </div>
  );
}
