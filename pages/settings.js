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
  Settings,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SettingsPage() {
  const { token, user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [householdSize, setHouseholdSize] = useState(1);
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     LOAD USER
  =============================== */
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setHouseholdSize(user.household_size || 1);
    }
  }, [user]);

  /* ===============================
     SAVE
  =============================== */
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      email,
      full_name: fullName,
      household_size: Number(householdSize),
      password: password || undefined,
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
          text: data.detail || "Erreur lors de la mise à jour.",
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
      {/* HEADER */}
      <div className="settings-header">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">
            Gérez votre profil, votre foyer et la sécurité de votre compte.
          </p>
        </div>
        <Settings size={42} className="icon-soft" />
      </div>

      <div className="card settings-card">
        <form onSubmit={handleSave} className="settings-form">
          {/* PROFIL */}
          <section className="settings-section">
            <h3>
              <User size={20} /> Profil
            </h3>

            <label className="field">
              <span>Nom complet</span>
              <div className="field-input">
                <User size={18} />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="field">
              <span>Adresse e-mail</span>
              <div className="field-input">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>
          </section>

          {/* FOYER */}
          <section className="settings-section">
            <h3>
              <Users size={20} /> Foyer
            </h3>

            <label className="field">
              <span>Nombre de personnes</span>
              <div className="field-input">
                <Users size={18} />
                <input
                  type="number"
                  min={1}
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(e.target.value)}
                />
              </div>
            </label>
          </section>

          {/* SÉCURITÉ */}
          <section className="settings-section">
            <h3>
              <ShieldCheck size={20} /> Sécurité
            </h3>

            <label className="field">
              <span>Nouveau mot de passe</span>
              <div className="field-input">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Laissez vide pour ne rien changer"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </label>
          </section>

          {/* MESSAGE */}
          {message && (
            <div
              className={`settings-message ${
                message.type === "success" ? "success" : "error"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={18} />
              ) : (
                <Lock size={18} />
              )}
              {message.text}
            </div>
          )}

          {/* SAVE */}
          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            <Save size={18} />
            {loading ? "Enregistrement…" : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}
