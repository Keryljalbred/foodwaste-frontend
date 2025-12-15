// pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import {
  User,
  Mail,
  Users,
  Lock,
  UserPlus,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [householdSize, setHouseholdSize] = useState(1);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     REGISTER
  =============================== */
  const registerUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          household_size: householdSize,
        }),
      });

      if (res.ok) {
        setMessage("✔ Compte créé avec succès. Redirection…");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        const err = await res.json().catch(() => null);
        setMessage(err?.detail || "Erreur lors de la création du compte.");
      }
    } catch {
      setMessage("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <UserPlus size={34} className="icon-animated" />
          <h1 className="page-title">Créer un compte</h1>
          <p className="page-subtitle">
            Rejoignez FoodWaste Zero et réduisez le gaspillage.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={registerUser} className="auth-form">
          <label className="field">
            <span className="field-label">Nom complet</span>
            <div className="field-input">
              <User size={18} />
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex : Marie Dupont"
                required
              />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Adresse e-mail</span>
            <div className="field-input">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                required
              />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Taille du foyer</span>
            <div className="field-input">
              <Users size={18} />
              <input
                type="number"
                min={1}
                value={householdSize}
                onChange={(e) => setHouseholdSize(Number(e.target.value))}
                required
              />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Mot de passe</span>
            <div className="field-input">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </label>

          {message && (
            <p
              className={
                message.startsWith("✔") ? "success-text" : "error-text"
              }
            >
              {message}
            </p>
          )}

          <button className="btn auth-btn" type="submit" disabled={loading}>
            {loading ? "Création…" : "Créer le compte"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="auth-footer">
          <span>Déjà un compte ?</span>
          <a href="/login">Se connecter</a>
        </div>
      </div>
    </div>
  );
}
