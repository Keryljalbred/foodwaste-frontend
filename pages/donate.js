export default function DonatePage() {
  return (
    <div className="page">
      <h1 className="page-title">Faire un don alimentaire</h1>
      <p className="page-subtitle">
        Choisissez une plateforme partenaire pour effectuer votre don.
      </p>

      <div className="card">
        <p>
            <button
            className="btn"
            onClick={() =>
                window.open("https://www.banquealimentaire.org", "_blank")
            }
            >
            🥫 Banques Alimentaires
            </button>
        </p>
        <p>
            <button
            className="btn"
            onClick={() =>
                window.open("https://www.restosducoeur.org", "_blank")
            }
            >
            ❤️ Restos du Cœur
            </button>
        </p>
        <p>
          <button
            className="btn"
            onClick={() =>
              window.open("https://www.toogoodtogo.com/fr", "_blank")
            }
          >
            🍽️ Too Good To Go
          </button>
        </p>
      </div>
    </div>
  );
}
