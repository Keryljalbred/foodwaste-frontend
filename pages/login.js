// pages/login.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔥 IMPORTANT : la redirection NE DOIT PAS être dans le rendu
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      // 🔥 NE RIEN METTRE ICI : redirection gérée par useEffect
    } catch (err) {
      console.log("Erreur login:", err);
      setError(err?.detail || "Identifiants invalides");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "80px auto" }}>
      <h1 className="page-title">Connexion</h1>

      <form onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p style={{ color: "red", fontSize: 14 }}>{error}</p>
        )}

        <button className="btn" type="submit">
          Se connecter
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Pas encore de compte ?{" "}
        <a href="/register" style={{ color: "var(--primary)" }}>
          Créer un compte
        </a>
      </p>
    </div>
  );
}
