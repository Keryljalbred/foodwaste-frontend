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

  if (!authReady) return <p>Chargement…</p>;

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/login");
    return <p>Redirection…</p>;
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

  const [scanMode, setScanMode] = useState(false);
  const [scanned, setScanned] = useState(false);

  /* ===============================
     FETCH CATEGORIES
  =============================== */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/categories/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [token]);

  /* ===============================
     BARCODE SCAN
  =============================== */
  const fetchProductByBarcode = async (barcode) => {
    try {
      const res = await fetch(`${API_BASE}/barcode/${barcode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data.name) setName(data.name);
      if (data.brand)
        setNotes((prev) =>
          prev ? `${prev}\nMarque : ${data.brand}` : `Marque : ${data.brand}`
        );

      setMessage({
        type: "success",
        text: "Produit détecté automatiquement via le code-barres.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Impossible de reconnaître ce produit.",
      });
    } finally {
      setScanMode(false);
      setScanned(false);
    }
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setDateError("");

    const selected = new Date(expirationDate);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      setDateError(
        "La date de péremption ne peut pas être antérieure à aujourd’hui."
      );
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

      if (!res.ok) throw new Error();

      setMessage({ type: "success", text: "Produit ajouté avec succès 🎉" });
      setName("");
      setCategoryId("");
      setQuantity(1);
      setExpirationDate("");
      setNotes("");
    } catch {
      setMessage({ type: "error", text: "Erreur lors de l’ajout du produit." });
    }
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="form-hero">
        <h1 className="page-title">Ajouter un produit</h1>
        <p className="page-subtitle">
          Ajoutez un produit manuellement ou scannez son code-barres.
        </p>
      </div>

      {/* CARD */}
      <div className="card form-card">
        {/* TITLE */}
        <div className="form-title">
          <PackagePlus className="icon-animated" size={30} />
          <h2>Nouveau produit</h2>
        </div>

        {/* SCAN */}
        <button
          type="button"
          className="btn-secondary scan-btn"
          onClick={() => {
            setScanMode(!scanMode);
            setScanned(false);
          }}
        >
          <ScanLine size={18} /> Scanner un produit
        </button>

        {scanMode && (
          <div className="scanner-box">
            <BarcodeScannerComponent
              width={280}
              height={280}
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
        <form onSubmit={handleSubmit} className="form-grid">
          <Field
            label="Nom du produit"
            icon={<Edit3 size={18} />}
            required
          >
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field label="Catégorie" icon={<Layers size={18} />}>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Sélectionner…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Quantité" icon={<NotebookPen size={18} />}>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Field>

          <Field
            label="Date de péremption"
            icon={<Calendar size={18} />}
            required
          >
            <input
              type="date"
              value={expirationDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </Field>

          {dateError && <p className="error-text">{dateError}</p>}

          <label>
            Notes
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          {message && (
            <p className={`message ${message.type}`}>
              {message.text}
            </p>
          )}

          <button className="btn submit-btn" type="submit">
            Ajouter le produit
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===============================
   FIELD COMPONENT
=============================== */
function Field({ label, icon, children, required }) {
  return (
    <label className="field">
      <span className="field-label">
        {label} {required && "*"}
      </span>
      <div className="field-input">
        <span className="field-icon">{icon}</span>
        {children}
      </div>
    </label>
  );
}
