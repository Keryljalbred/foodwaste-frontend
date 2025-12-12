// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Charger token + le valider AVANT de mettre authReady à true
  useEffect(() => {
    async function initAuth() {
      const stored = localStorage.getItem("fwz_token");

      if (!stored) {
        // Pas de token → utilisateur NON connecté
        setIsAuthenticated(false);
        setUser(null);
        setAuthReady(true);
        return;
      }

      // Vérification du token immédiatement
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${stored}` },
        });

        if (!res.ok) {
          // Token invalide → nettoyer
          localStorage.removeItem("fwz_token");
          setIsAuthenticated(false);
          setToken(null);
          setUser(null);
          setAuthReady(true);
          return;
        }

        const data = await res.json();

        // Token valide
        setToken(stored);
        setUser(data);
        setIsAuthenticated(true);
        setAuthReady(true);

      } catch (err) {
        console.error("Erreur validation token :", err);
        localStorage.removeItem("fwz_token");
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        setAuthReady(true);
      }
    }

    initAuth();
  }, []);

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

    // Sauvegarde + validation immédiate
    localStorage.setItem("fwz_token", accessToken);
    setToken(accessToken);
    setIsAuthenticated(true);

    // Récupérer user
    const me = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const meData = await me.json();
    setUser(meData);

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
