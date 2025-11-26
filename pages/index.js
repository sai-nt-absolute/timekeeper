
import { useEffect, useState } from "react";
import "./index.css";

export default function Index() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("name_asc");

  const [filtered, setFiltered] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // Mobile toggle

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/watches")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          const arr = Array.isArray(data) ? data : (data.watches || []);
          const norm = arr.map((it) => ({
            id: it._id || it.id,
            name: it.name || "",
            model: it.model || "",
            modelId: it.modelId || "",
            subModel: it.subModel || "",
            price: typeof it.price === "number" ? it.price : parseFloat(String(it.price).replace(/[^0-9.]/g, "")) || 0,
            image: it.image || ""
          }));
          setItems(norm);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => (cancelled = true);
  }, []);

  useEffect(() => {
    const normalizedQ = q.trim().toLowerCase();
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    const out = items.filter((it) => {
      if (normalizedQ && !(it.name.toLowerCase().includes(normalizedQ) || it.model.toLowerCase().includes(normalizedQ))) return false;
      if (!isNaN(min) && it.price < min) return false;
      if (!isNaN(max) && it.price > max) return false;
      return true;
    });

    out.sort((a, b) => {
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      if (sort === "name_desc") return b.name.localeCompare(a.name);
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      return 0;
    });

    setFiltered(out);
  }, [items, q, minPrice, maxPrice, sort]);

  const clearFilters = () => {
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    setSort("name_asc");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1 className="title">Timekeeper</h1>

          {/* Mobile toggle */}
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            Advanced Filters
          </button>

          {/* Filters */}
          <div className={`filters ${showFilters ? "show" : ""}`}>
            <input
              placeholder="Search name or model..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name_asc">Name ↑</option>
              <option value="name_desc">Name ↓</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>
            <button onClick={clearFilters}>Clear</button>
            <button onClick={() => (window.location.href = "/admin")} className="primary-btn">
              Add Watch
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty">Loading watches…</div>
        ) : error ? (
          <div className="empty">Error loading watches: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No watches found. Try clearing filters.</div>
        ) : (
          <div className="grid">
            {filtered.map((it) => (
              <div key={it.id} className="card">
                <div className="image-wrapper">
                  <img
                    src={
                      it.image.startsWith("http")
                        ? it.image
                        : `data:image/jpeg;base64,${it.image}`
                    }
                    alt={it.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>
                <div>
                  <div className="name-row">
                    <h3>{it.name}</h3>
                    <div className="price">₹{Number(it.price).toLocaleString("en-IN")}</div>
                  </div>
                  {it.model && (
                    <div className="model-text">
                      {it.model || "N/A"} {it.subModel ? `• ${it.subModel}` : ""}
                    </div>
                  )}
                  <div className="small-text">Model ID: {it.modelId || "N/A"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
