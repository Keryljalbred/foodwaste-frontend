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

  // 🛑 NE RIEN AFFICHER TANT QUE L’AUTH N’EST PAS PRÊTE
  if (!authReady) return <p>Chargement...</p>;

  // 🔐 SI PAS CONNECTÉ → LOGIN
  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/login");
    return <p>Redirection...</p>;
  }

  // 🧠 ICI → l’utilisateur est authentifié → LA PAGE PEUT S’AFFICHER
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState(null);

  // 🔥 Charger les catégories depuis l’API
useEffect(() => {
  if (!token) return;

  fetch(`${API_BASE}/categories/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => setCategories(data))
    .catch(() => setCategories([]));
}, [token]);


  // 🔥 Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

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

        // Reset du formulaire
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
      setMessage({ type: "error", text: "Erreur lors de l'ajout." });
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Ajouter un produit</h1>
      <p className="page-subtitle">
        Renseignez les informations de votre produit pour suivre sa fraîcheur.
      </p>

      <div className="card" style={{ maxWidth: 650, margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <PackagePlus size={30} color="var(--primary-dark)" />
          <h2 style={{ margin: 0, fontSize: 20 }}>Nouveau produit</h2>
        </div>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          {/* Nom */}
          <label>
            Nom du produit *
            <div className="input-with-icon">
              <Edit3 size={18} className="input-icon" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Yaourt nature"
                required
              />
            </div>
          </label>

          {/* Catégorie */}
          <label>
            Catégorie
            <div className="input-with-icon">
              <Layers size={18} className="input-icon" />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: 36,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                }}
              >
                <option value="">Sélectionner une catégorie…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </label>

          {/* Quantité */}
          <label>
            Quantité
            <div className="input-with-icon">
              <NotebookPen size={18} className="input-icon" />
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
              />
            </div>
          </label>

          {/* Date d’expiration */}
          <label>
            Date de péremption *
            <div className="input-with-icon">
              <Calendar size={18} className="input-icon" />
              <input
                type="date"
                value={expirationDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
              />
            </div>
          </label>

          {/* Notes */}
          <label>
            Notes (facultatif)
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations utiles : marque, emplacement, etc."
              style={{ resize: "none" }}
            />
          </label>

          {/* MESSAGE */}
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

          <button className="btn" type="submit" style={{ marginTop: 6 }}>
            Ajouter le produit
          </button>
        </form>
      </div>

      <style jsx>{`
        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.6;
        }

        .input-with-icon input,
        .input-with-icon select {
          padding-left: 36px;
        }
      `}</style>
    </div>
  );
}
