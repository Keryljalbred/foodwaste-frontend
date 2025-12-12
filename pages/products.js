// pages/add-product.js
export const ssr = false;   // ← OBLIGATOIRE SUR RENDER

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

  if (!authReady) return <p>Chargement…</p>;
  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/login");
    return <p>Redirection…</p>;
  }

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

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
        setName("");
        setCategoryId("");
        setQuantity(1);
        setExpirationDate("");
        setNotes("");
      } else {
        setMessage({ type: "error", text: await res.text() });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l'ajout." });
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Ajouter un produit</h1>

      <div className="card" style={{ maxWidth: 650, margin: "0 auto" }}>
        {/* form */}
      </div>
    </div>
  );
}
