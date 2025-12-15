// pages/login.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     REDIRECTION
  =============================== */
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err?.detail || "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        {/* HEADER */}
        <div className="auth-header">
          <LogIn size={34} className="icon-animated" />
          <h1 className="page-title">Connexion</h1>
          <p className="page-subtitle">
            Accédez à votre espace FoodWaste Zero
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="auth-form">
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

          {error && <p className="error-text">{error}</p>}

          <button className="btn auth-btn" type="submit" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="auth-footer">
          <span>Pas encore de compte ?</span>
          <a href="/register">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}
