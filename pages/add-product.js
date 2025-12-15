// pages/add-product.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import {
  PackagePlus,
  Calendar,
  Edit3,
  Layers,
  NotebookPen,
  ScanLine,
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

  /* ===============================
     STATES
  =============================== */
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState(null);
  const [dateError, setDateError] = useState("");

  // Scan
  const [scanMode, setScanMode] = useState(false);
  const [scanned, setScanned] = useState(false);

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
     Scan code-barres
  =============================== */
  const fetchProductByBarcode = async (barcode) => {
    try {
      const res = await fetch(`${API_BASE}/barcode/${barcode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Produit non trouvé");
      }

      const data = await res.json();

      if (data.name) setName(data.name);
      if (data.brand)
        setNotes((prev) =>
          prev ? `${prev}\nMarque : ${data.brand}` : `Marque : ${data.brand}`
        );

      setMessage({
        type: "success",
        text: "Produit détecté via le code-barres ✅",
      });

      setScanMode(false);
    } catch {
      setMessage({
        type: "error",
        text: "Produit non reconnu via le code-barres.",
      });
      setScanMode(false);
    }
  };

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
        Ajoutez un produit manuellement ou via scan de code-barres.
      </p>

      <div className="card" style={{ maxWidth: 650, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <PackagePlus size={30} color="var(--primary-dark)" />
          <h2>Nouveau produit</h2>
        </div>

        {/* 🔍 SCAN */}
        <button
          type="button"
          className="btn-secondary"
          style={{ marginBottom: 12 }}
          onClick={() => {
            setScanMode(!scanMode);
            setScanned(false);
          }}
        >
          <ScanLine size={18} /> Scanner un produit
        </button>

        {scanMode && (
          <div style={{ marginBottom: 16 }}>
            <BarcodeScannerComponent
              width={300}
              height={300}
              onUpdate={(err, result) => {
                if (result && !scanned) {
                  setScanned(true);
                  fetchProductByBarcode(result.text);
                }
              }}
            />
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <label>
            Nom du produit *
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

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

          <label>
            Quantité
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>

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
