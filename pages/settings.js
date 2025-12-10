// pages/settings.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Users,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Save,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

export default function SettingsPage() {
  const { token, user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [householdSize, setHouseholdSize] = useState(1);
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Charger les infos utilisateur
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setHouseholdSize(user.household_size || 1);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      email,
      full_name: fullName,
      household_size: Number(householdSize),
      password: password || undefined, // facultatif
    };

    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Profil mis à jour avec succès.",
        });
        refreshUser();
        setPassword("");
      } else {
        setMessage({
          type: "error",
          text: data.detail || "Erreur inconnue.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Erreur réseau.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">Paramètres du compte</h1>
      <p className="page-subtitle">
        Gérez vos informations personnelles, votre foyer et la sécurité de votre compte.
      </p>

      <div
        className="card"
        style={{ maxWidth: 700, margin: "0 auto", padding: "24px 22px" }}
      >
        <form
          onSubmit={handleSave}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* SECTION - IDENTITÉ */}
          <section>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <User size={20} /> Profil
            </h3>

            <label>
              Nom complet *
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              Adresse e-mail *
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>
          </section>

          {/* SECTION - FOYER */}
          <section>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Users size={20} /> Taille du foyer
            </h3>

            <label>
              Nombre de personnes *
              <div className="input-with-icon">
                <Users className="input-icon" size={18} />
                <input
                  type="number"
                  min={1}
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(e.target.value)}
                />
              </div>
            </label>
          </section>

          {/* SECTION - SÉCURITÉ */}
          <section>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ShieldCheck size={20} /> Sécurité
            </h3>

            <label>
              Nouveau mot de passe (optionnel)
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  placeholder="Laissez vide pour ne rien changer"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </label>
          </section>

          {/* MESSAGE FEEDBACK */}
          {message && (
            <div
              style={{
                borderRadius: 10,
                padding: "10px 12px",
                fontWeight: 600,
                backgroundColor:
                  message.type === "success" ? "#ECFDF3" : "#FEE2E2",
                color:
                  message.type === "success" ? "#166534" : "#B91C1C",
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 8,
              }}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <Lock size={18} />
              )}
              {message.text}
            </div>
          )}

          {/* BOUTON ENREGISTRER */}
          <button
            disabled={loading}
            className="btn"
            type="submit"
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
            }}
          >
            <Save size={18} />
            {loading ? "Enregistrement…" : "Enregistrer les modifications"}
          </button>
        </form>
      </div>

      {/* STYLES LOCAUX POUR LES INPUTS AVEC ICÔNES */}
      <style jsx>{`
        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.55;
        }

        .input-with-icon input {
          padding-left: 36px !important;
        }
      `}</style>
    </div>
  );
}
