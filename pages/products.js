// pages/add-product.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { PackagePlus, Layers, Calendar, Edit3 } from "lucide-react";

// ALWAYS DISABLE SSR ON RENDER
export const ssr = false;

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AddProductPage() {
  const router = useRouter();
  const { token, isAuthenticated, authReady } = useAuth();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [categories, setCategories] = useState([]);

  const [msg, setMsg] = useState(null);

  // Attendre le contexte d'auth
  useEffect(() => {
    if (authReady && !isAuthenticated) {
      router.push("/login");
    }
  }, [authReady, isAuthenticated]);

  // Charger catégories
  useEffect(() => {
    fetch(`${API_BASE}/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!name.trim()) {
      setMsg({ type: "error", text: "Le nom est obligatoire." });
      return;
    }

    const payload = {
      name,
      quantity: Number(quantity),
      expiration_date: expirationDate,
      notes: notes || null,
      category_id: categoryId ? Number(categoryId) : null,
    };

    try {
      const res = await fetch(`${API_BASE}/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 201) {
        setMsg({ type: "success", text: "Produit ajouté !" });

        // Reset formulaire
        setName("");
        setQuantity(1);
        setExpirationDate("");
        setCategoryId("");
        setNotes("");

        // Redirection légère après 1 sec
        setTimeout(() => router.push("/products"), 800);
      } else {
        setMsg({ type: "error", text: await res.text() });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Erreur lors de l'ajout." });
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Ajouter un produit</h1>

      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          {/* Nom */}
          <label>
            Nom du produit
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <PackagePlus size={18} color="var(--primary)" />
              <input
                type="text"
                placeholder="Ex : Yaourt nature"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </label>

          {/* Quantité */}
          <label>
            Quantité
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Layers size={18} color="var(--primary)" />
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </label>

          {/* Catégorie */}
          <label>
            Catégorie
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Aucune catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Date d'expiration */}
          <label>
            Date d'expiration
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Calendar size={18} color="var(--primary)" />
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>
          </label>

          {/* Notes */}
          <label>
            Notes
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Edit3 size={18} color="var(--primary)" />
              <textarea
                placeholder="Infos supplémentaires…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </label>

          {/* Message */}
          {msg && (
            <p
              style={{
                color: msg.type === "error" ? "#b91c1c" : "green",
                fontWeight: 600,
                marginTop: 10,
              }}
            >
              {msg.text}
            </p>
          )}

          <button type="submit" className="btn" style={{ width: "100%", marginTop: 12 }}>
            Ajouter le produit
          </button>
        </form>
      </div>
    </div>
  );
}
