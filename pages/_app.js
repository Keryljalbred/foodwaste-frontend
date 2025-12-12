// pages/_app.js
import "../styles/globals.css";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import {
  Home,
  Package,
  ChefHat,
  BrainCircuit,
  Settings,
  BarChart2,
  Menu,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);

  if (!isAuthenticated) return null;

  const links = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Produits", icon: <Package size={18} />, path: "/products" },
    { name: "Ajouter un produit", icon: <Package size={18} />, path: "/add-product" },
    { name: "Recettes", icon: <ChefHat size={18} />, path: "/recipes" },
    { name: "Prédiction", icon: <BrainCircuit size={18} />, path: "/ml" },
    { name: "Statistiques", icon: <BarChart2 size={18} />, path: "/statistics" },
    { name: "Paramètres", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <header className="navbar-pro">
      <div className="nav-left">
        <div className="brand" onClick={() => router.push("/dashboard")}>
          FoodWaste Zero
        </div>
        <nav className="nav-links">
          {links.map((link) => (
            <div
              key={link.path}
              className={`nav-item ${router.pathname === link.path ? "active" : ""}`}
              onClick={() => router.push(link.path)}
            >
              {link.icon}
              <span>{link.name}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="nav-right">
        <span className="user-label">
          {user ? user.full_name || user.email : "" }
        </span>

        <button
          className="logout-btn"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

function ProtectedShell({ Component, pageProps }) {
  const router = useRouter();
  const { isAuthenticated, authReady } = useAuth();

  const publicRoutes = ["/", "/login", "/register"];
  const currentPath = router.asPath.split("?")[0];
  const isPublic = publicRoutes.includes(currentPath);

  // 1️⃣ Attendre que AuthContext soit prêt
  if (!authReady) {
    return (
      <div className="app-shell">
        <div className="app-main">Chargement...</div>
      </div>
    );
  }

  // 2️⃣ Si non connecté → redirection seulement si route privée
  if (!isAuthenticated && !isPublic) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Component {...pageProps} />
      </main>
    </div>
  );
}


function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ProtectedShell Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
