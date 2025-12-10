// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = "http://localhost:8000";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ⬅️ IMPORTANT : indique si on a fini de vérifier le token
  const [authReady, setAuthReady] = useState(false);

  // Charger token depuis localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem("fwz_token");
    if (stored) setToken(stored);
  }, []);

  // Vérifier si le token est valide
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthReady(true);   // ⬅️ même si token vide, on a fini
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Token invalide
          localStorage.removeItem("fwz_token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setAuthReady(true);
          return;
        }

        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
        setAuthReady(true);

      } catch (e) {
        console.error("Erreur /me:", e);
        setIsAuthenticated(false);
        setAuthReady(true);
      }
    };

    checkToken();
  }, [token]);

  // =========================
  //      LOGIN
  // =========================
  const login = async (email, password) => {
    const body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append("username", email);
    body.append("password", password);

    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (res.status === 401) {
      throw { detail: "Identifiants invalides" };
    }

    if (!res.ok) {
      let err;
      try {
        err = await res.json();
      } catch {
        err = { detail: "Erreur inconnue" };
      }
      throw err;
    }

    const data = await res.json();
    const accessToken = data.access_token;

    localStorage.setItem("fwz_token", accessToken);
    setToken(accessToken);

    return accessToken;
  };

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
        authReady,       // ⬅️ AJOUT ESSENTIEL
        login,
        logout,
        refreshUser: () => setToken(localStorage.getItem("fwz_token")),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
