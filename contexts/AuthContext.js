// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// URL backend
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Indique si les vérifications sont FINIES
  const [authReady, setAuthReady] = useState(false);

  // Charger le token au démarrage
  useEffect(() => {
    const stored = localStorage.getItem("fwz_token");

    if (!stored) {
      setAuthReady(true);
      return;
    }

    setToken(stored);
  }, []);

  // Vérifier le token quand il change
  useEffect(() => {
    async function validate() {
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthReady(true);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Token faux → déconnecter proprement
          localStorage.removeItem("fwz_token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setAuthReady(true);
          return;
        }

        // Token valide → enregistrer user
        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
        setAuthReady(true);

      } catch (err) {
        console.error("Erreur /me :", err);
        localStorage.removeItem("fwz_token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthReady(true);
      }
    }

    validate();
  }, [token]);

  // LOGIN
  const login = async (email, password) => {
    const body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append("username", email);
    body.append("password", password);

    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) {
      throw { detail: "Identifiants invalides" };
    }

    const data = await res.json();
    const accessToken = data.access_token;

    localStorage.setItem("fwz_token", accessToken);
    setToken(accessToken);

    return accessToken;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("fwz_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        authReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
