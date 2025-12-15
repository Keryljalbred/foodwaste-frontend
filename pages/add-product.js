// pages/add-product.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import {
  PackagePlus,
  Calendar,
  Edit3,
  Layers,
  NotebookPen,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AddProductPage() {
  const { token, isAuthenticated, authReady } = useAuth();
  const router = useRouter();

  if (!authReady) return <p>Chargement...</p>;

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/login");
    return <p>Redirection...</p>;
  }

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState(null);
  const [dateError, setDateError] = useState("");

  /* ===============================
     Charger catégories
  =============================== */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/categories/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, [token]);

  /* ===============================
     Soumission formulaire
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setDateError("");

    // 🛑 Validation date
    if (expirationDate) {
      const selectedDate = new Date(expirationDate);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError(
          "❌ La date de péremption ne peut pas être antérieure à aujourd’hui."
        );
        return;
      }
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
        setMessage({ type: "success", text: "Produit ajouté avec succès !" });
        setName("");
        setCategoryId("");
        setQuantity(1);
        setExpirationDate("");
        setNotes("");
      } else {
        const err = await res.text();
        setMessage({ type: "error", text: err });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'ajout du produit." });
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Ajouter un produit</h1>
      <p className="page-subtitle">
        Renseignez les informations de votre produit.
      </p>

      <div className="card" style={{ maxWidth: 650, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <PackagePlus size={30} color="var(--primary-dark)" />
          <h2>Nouveau produit</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nom */}
          <label>
            Nom du produit *
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          {/* Catégorie */}
          <label>
            Catégorie
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Sélectionner une catégorie…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Quantité */}
          <label>
            Quantité
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>

          {/* Date */}
          <label>
            Date de péremption *
            <input
              type="date"
              value={expirationDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
            />
          </label>

          {dateError && (
            <p style={{ color: "#e74c3c", fontWeight: 600 }}>{dateError}</p>
          )}

          {/* Notes */}
          <label>
            Notes
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          {message && (
            <p
              style={{
                color: message.type === "success" ? "green" : "red",
                fontWeight: 600,
              }}
            >
              {message.text}
            </p>
          )}

          <button className="btn" type="submit">
            Ajouter le produit
          </button>
        </form>
      </div>
    </div>
  );
}
