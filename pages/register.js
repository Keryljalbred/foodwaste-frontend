// pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";

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
        setMessage("Compte créé ✔ Redirection...");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        const err = await res.json().catch(() => null);
        setMessage(err?.detail || "Erreur lors de l'inscription.");
      }
    } catch {
      setMessage("Erreur réseau.");
    }

    setLoading(false);
  };

  return (
    <div className="card" style={{ maxWidth: 500, margin: "80px auto" }}>
      <h1 className="page-title">Créer un compte</h1>

      <form onSubmit={registerUser}>
        <label>
          Nom complet
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>

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
          Taille du foyer
          <input
            type="number"
            value={householdSize}
            onChange={(e) => setHouseholdSize(Number(e.target.value))}
            min={1}
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

        {message && (
          <p
            style={{
              marginTop: 10,
              color: message.includes("✔") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Création..." : "Créer le compte"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Déjà un compte ?{" "}
        <a href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          Se connecter
        </a>
      </p>
    </div>
  );
}
