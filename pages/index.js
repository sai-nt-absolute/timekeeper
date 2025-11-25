
import { useEffect, useState } from "react";

const styles = {
  page: {
    maxWidth: "100%",
    margin: "28px auto",
    padding: 20,
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    background: "#fff",
  },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 },
  title: { margin: 0, fontSize: 26, color: "#0f172a", letterSpacing: "-0.2px" },
  controls: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  input: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #e6e9ee",
    fontSize: 14,
    outline: "none",
    background: "#fff"
  },
  filterGroup: { display: "flex", gap: 8, alignItems: "center" },
  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: 320,
    minHeight: 400,
    borderRadius: 12,
    padding: 14,
    background: "#fff",
    border: "1px solid #e6e9ee",
    boxShadow: "0 6px 20px rgba(2,6,23,0.04)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  nameRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 },
  name: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },
  modelText: { fontSize: 13, color: "#475569", marginTop: 4 },
  price: { fontSize: 18, color: "#059669", fontWeight: 800 },
  smallText: { fontSize: 12, color: "#6b7280" },
  empty: { padding: 28, textAlign: "center", color: "#6b7280" },
  controlsRight: { display: "flex", gap: 12, alignItems: "center" }
};

export default function Index() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [q, setQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("name_asc");

  const [filtered, setFiltered] = useState([]);

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
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Timekeeper</h1>

        <div style={styles.controls}>
          <div style={styles.filterGroup}>
            <input
              placeholder="Search name or model..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ ...styles.input, width: 280 }}
            />
            <input
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ ...styles.input, width: 110 }}
            />
            <input
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ ...styles.input, width: 110 }}
            />
          </div>

          <div style={styles.controlsRight}>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.input}>
              <option value="name_asc">Name ↑</option>
              <option value="name_desc">Name ↓</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </select>

            <button onClick={clearFilters} style={{ ...styles.input, cursor: "pointer" }}>Clear</button>

            <button
              onClick={() => (window.location.href = "/admin")}
              style={styles.primaryBtn}
            >
              Add Watch
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.empty}>Loading watches…</div>
      ) : error ? (
        <div style={styles.empty}>Error loading watches: {error}</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No watches found. Try clearing filters.</div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((it) => (
            <div key={it.id} style={styles.card}>
              <div style={styles.imageWrapper}>
                <img
                  src={
                    it.image.startsWith("http")
                      ? it.image // If it's a URL, use as-is
                      : `data:image/jpeg;base64,${it.image}` // If it's Base64, prepend prefix
                  }
                  alt={it.name}
                  style={styles.image}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              </div>

              {/* Details pinned to bottom */}
              <div>
                <div style={styles.nameRow}>
                  <h3 style={styles.name}>{it.name}</h3>
                  <div style={styles.price}>₹{Number(it.price).toLocaleString("en-IN")}</div>
                </div>

                {it.model && (
                  <div style={styles.modelText}>
                    {it.model || "N/A"} {it.subModel ? `• ${it.subModel}` : ""}
                  </div>
                )}

                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={styles.smallText}>Model ID: {it.modelId || "N/A"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
