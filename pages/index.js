import { useEffect, useState } from "react";

const styles = {
  page: {
    maxWidth: 1100,
    margin: "28px auto",
    padding: 20,
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 },
  title: { margin: 0, fontSize: 22, color: "#111827" },
  controls: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  input: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    outline: "none",
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
  grid: { display: "flex", gap: 16, flexWrap: "wrap" },
  card: {
    width: 220,
    borderRadius: 10,
    padding: 12,
    background: "#fff",
    border: "1px solid #e6e9ee",
    boxShadow: "0 6px 18px rgba(14, 20, 30, 0.04)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  image: { width: "100%", height: 140, objectFit: "cover", borderRadius: 8, background: "#f3f4f6" },
  name: { fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 },
  price: { fontSize: 14, color: "#059669", fontWeight: 700 },
  metaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 },
  smallBtn: {
    padding: "6px 8px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fafafa",
    cursor: "pointer",
    fontSize: 13,
  },
  empty: { padding: 28, textAlign: "center", color: "#6b7280" },
  badge: { padding: "4px 8px", borderRadius: 999, background: "#eef2ff", color: "#312e81", fontSize: 12, fontWeight: 600 },
  pill: { padding: "6px 10px", borderRadius: 999, background: "#f8fafc", color: "#374151", fontSize: 13 }
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

  // derived
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
          // expect array of { id, name, price, image }
          setItems(Array.isArray(data) ? data : (data.watches || []));
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
    // apply filters and sort
    const normalizedQ = q.trim().toLowerCase();
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    const out = items.filter((it) => {
      if (normalizedQ && !it.name.toLowerCase().includes(normalizedQ)) return false;
      const priceNum = parseFloat(String(it.price).replace(/[^0-9.]/g, ""));
      if (!isNaN(min) && priceNum < min) return false;
      if (!isNaN(max) && priceNum > max) return false;
      return true;
    });

    out.sort((a, b) => {
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      if (sort === "name_desc") return b.name.localeCompare(a.name);
      const pa = parseFloat(String(a.price).replace(/[^0-9.]/g, "")) || 0;
      const pb = parseFloat(String(b.price).replace(/[^0-9.]/g, "")) || 0;
      if (sort === "price_asc") return pa - pb;
      if (sort === "price_desc") return pb - pa;
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

  const handleDelete = async (id) => {
    if (!confirm("Delete this watch?")) return;
    try {
      const res = await fetch(`/api/watches/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setItems((s) => s.filter((it) => it.id !== id));
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Timekeeper</h1>

        <div style={styles.controls}>
          <div style={styles.filterGroup}>
            <input
              placeholder="Search name..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ ...styles.input, width: 110 }}
            />
            <input
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ ...styles.input, width: 110 }}
            />
          </div>

          <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.input}>
            <option value="name_asc">Name ↑</option>
            <option value="name_desc">Name ↓</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>

          <button onClick={clearFilters} style={styles.smallBtn}>Clear</button>

          <button
            onClick={() => {
              /* placeholder: navigate to add page or open modal */
              window.location.href = "/admin";
            }}
            style={styles.primaryBtn}
          >
            Add Watch
          </button>
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
              <img
                src={it.image || ""}
                alt={it.name}
                style={styles.image}
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' fill='%239ca3af' font-size='18' font-family='Arial' text-anchor='middle' dy='.3em'%3ENo image%3C/text%3E%3C/svg%3E";
                }}
              />
              <div>
                <p style={styles.name}>{it.name}</p>
                <div style={styles.metaRow}>
                  <div style={styles.price}>${String(it.price)}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={styles.smallBtn}
                      onClick={() => {
                        // placeholder edit action
                        window.location.href = `/admin?edit=${it.id}`;
                      }}
                    >
                      Edit
                    </button>
                    <button style={styles.smallBtn} onClick={() => handleDelete(it.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", alignItems: "center" }}>
                <div style={styles.pill}>ID: {it.id}</div>
                <div style={styles.badge}>{/* optionally a category or status */}New</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
