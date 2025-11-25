import { useState, useRef } from "react";

const styles = {
  container: {
    maxWidth: 480,
    margin: "40px auto",
    padding: 24,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    background: "#fff",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  title: { margin: 0, marginBottom: 14, fontSize: 20, color: "#111827" },
  formRow: { marginBottom: 12 },
  label: { display: "block", fontSize: 13, marginBottom: 6, color: "#374151" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  inputFocus: { borderColor: "#6366f1", boxShadow: "0 0 0 4px rgba(99,102,241,0.06)" },
  row: { display: "flex", gap: 8 },
  smallBtn: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fafafa",
    cursor: "pointer",
  },
  primaryBtn: {
    marginTop: 6,
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryText: { fontSize: 13, color: "#6b7280", marginTop: 8 },
  success: { color: "#059669" },
  error: { color: "#dc2626" },
  hint: { fontSize: 12, color: "#9ca3af", marginTop: 6 },
  imagePreview: { width: 92, height: 92, borderRadius: 8, objectFit: "cover", border: "1px solid #e5e7eb" },
  toggleGroup: { display: "flex", gap: 8, marginBottom: 12 },
  fileButton: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  fileName: { fontSize: 13, color: "#6b7280", marginLeft: 8 }
};

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [form, setForm] = useState({ name: "", price: "", image: "" });
  const [imageFile, setImageFile] = useState(null); // File object
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // preview for file or url
  const [imageMode, setImageMode] = useState("url"); // "url" or "file"

  const fileInputRef = useRef(null);

  const [focused, setFocused] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", msg: string }

  // Basic client-side validation
  const validateForm = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.price.trim()) return "Price is required.";
    const priceNormalized = form.price.replace(/[^0-9.]/g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(priceNormalized)) return "Enter a valid price (numbers, up to 2 decimals).";

    if (imageMode === "url") {
      if (form.image && !/^https?:\/\//i.test(form.image)) return "Image URL must start with http:// or https://";
    } else {
      if (!imageFile) return "Please select an image file.";
      if (imageFile.size > 5 * 1024 * 1024) return "Image file must be under 5 MB.";
      if (!imageFile.type.startsWith("image/")) return "Selected file must be an image.";
    }

    return null;
  };

  const login = async () => {
    setStatus(null);
    setLoadingLogin(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setLoggedIn(true);
        setStatus({ type: "success", msg: "Logged in." });
      } else {
        setStatus({ type: "error", msg: "Incorrect admin password." });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Network error. Try again." });
    } finally {
      setLoadingLogin(false);
    }
  };

  const addWatch = async () => {
    setStatus(null);
    const validationError = validateForm();
    if (validationError) {
      setStatus({ type: "error", msg: validationError });
      return;
    }

    setSubmitting(true);
    try {
      let res;
      if (imageMode === "url") {
        res = await fetch("/api/watches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        });
      } else {
        const data = new FormData();
        data.append("name", form.name);
        data.append("model", form.model);
        data.append("subModel", form.subModel);
        data.append("modelId", form.modelId);
        data.append("price", form.price);
        data.append("imageFile", imageFile);
        res = await fetch("/api/watches", {
          method: "POST",
          body: data
        });
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Server error");
      }

      setStatus({ type: "success", msg: "Watch added!" });
      setForm({ name: "", price: "", image: "" });
      setImageFile(null);
      setImagePreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setStatus({ type: "error", msg: err.message || "Failed to add watch." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus(null), 3500);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreviewUrl("");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreviewUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const fillSampleImage = () => {
    if (imageMode === "url") {
      const sample = "https://images.unsplash.com/photo-1517059224940-d4af9eec41e6?w=800&q=80";
      setForm((f) => ({ ...f, image: sample }));
      setImagePreviewUrl(sample);
    } else {
      setStatus({ type: "error", msg: "Select a file from your device for upload." });
      setTimeout(() => setStatus(null), 2500);
    }
  };

  const onPasswordKeyDown = (e) => {
    if (e.key === "Enter") login();
  };
  const onFormKeyDown = (e) => {
    if (e.key === "Enter") addWatch();
  };

  if (!loggedIn)
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Admin Login</h2>

        <div style={styles.formRow}>
          <label style={styles.label} htmlFor="admin-password">Password</label>
          <div style={styles.row}>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onPasswordKeyDown}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused("")}
              style={{
                ...styles.input,
                ...(focused === "password" ? styles.inputFocus : {}),
                flex: 1
              }}
              aria-label="Admin password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
              style={styles.smallBtn}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          onClick={login}
          disabled={loadingLogin || !password.trim()}
          style={{
            ...styles.primaryBtn,
            opacity: loadingLogin || !password.trim() ? 0.7 : 1,
            cursor: loadingLogin ? "progress" : "pointer"
          }}
        >
          {loadingLogin ? "Signing in…" : "Sign in"}
        </button>

        {status && (
          <div style={{ marginTop: 12 }}>
            <span style={status.type === "success" ? styles.success : styles.error}>{status.msg}</span>
          </div>
        )}

        <p style={styles.hint}>Use your admin password to access the watch catalog editor.</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Watch</h2>

      <div style={styles.formRow}>
        <label style={styles.label} htmlFor="Brand-name">Watch Name</label>
        <input
          id="watch-name"
          placeholder="e.g. Casio"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onKeyDown={onFormKeyDown}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused("")}
          style={{ ...styles.input, ...(focused === "name" ? styles.inputFocus : {}) }}
        />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label} htmlFor="Model-name">Model Name</label>
        <input
          id="=model-name"
          placeholder="e.g. G-shock"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          onKeyDown={onFormKeyDown}
          onFocus={() => setFocused("model")}
          onBlur={() => setFocused("")}
          style={{ ...styles.input, ...(focused === "model" ? styles.inputFocus : {}) }}
        />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label} htmlFor="Sub-Model">Sub Model</label>
        <input
          id="sub-model"
          placeholder="e.g. Mud-Master"
          value={form.subModel}
          onChange={(e) => setForm({ ...form, subModel: e.target.value })}
          onKeyDown={onFormKeyDown}
          onFocus={() => setFocused("subModel")}
          onBlur={() => setFocused("")}
          style={{ ...styles.input, ...(focused === "subModel" ? styles.inputFocus : {}) }}
        />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label} htmlFor="Model Id">Model Id</label>
        <input
          id="model-id"
          placeholder="e.g. GWGB1000EC1A"
          value={form.modelId}
          onChange={(e) => setForm({ ...form, modelId: e.target.value })}
          onKeyDown={onFormKeyDown}
          onFocus={() => setFocused("modelId")}
          onBlur={() => setFocused("")}
          style={{ ...styles.input, ...(focused === "modelId" ? styles.inputFocus : {}) }}
        />
      </div>

      <div style={styles.formRow}>
        <label style={styles.label} htmlFor="Price">Price</label>
        <input
          id="watch-price"
          placeholder="e.g. 10000"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          onKeyDown={onFormKeyDown}
          onFocus={() => setFocused("price")}
          onBlur={() => setFocused("")}
          style={{ ...styles.input, ...(focused === "price" ? styles.inputFocus : {}) }}
        />
      </div>

      <div style={styles.formRow}>
        <div style={styles.toggleGroup}>
          <button
            type="button"
            onClick={() => setImageMode("url")}
            style={{
              ...styles.smallBtn,
              background: imageMode === "url" ? "#eef2ff" : "#fafafa",
              borderColor: imageMode === "url" ? "#c7bfff" : "#e5e7eb"
            }}
          >
            Image URL
          </button>
          <button
            type="button"
            onClick={() => setImageMode("file")}
            style={{
              ...styles.smallBtn,
              background: imageMode === "file" ? "#eef2ff" : "#fafafa",
              borderColor: imageMode === "file" ? "#c7bfff" : "#e5e7eb"
            }}
          >
            Upload File
          </button>
          <div style={{ marginLeft: "auto", alignSelf: "center", color: "#6b7280", fontSize: 13 }}>
            {imageMode === "url" ? "Send URL" : "Send file"}
          </div>
        </div>

        {imageMode === "url" ? (
          <>
            <label style={styles.label} htmlFor="watch-image">Image URL</label>
            <div style={styles.row}>
              <input
                id="watch-image"
                placeholder="https://example.com/watch.jpg"
                value={form.image}
                onChange={(e) => {
                  setForm({ ...form, image: e.target.value });
                  setImagePreviewUrl(e.target.value);
                }}
                onKeyDown={onFormKeyDown}
                onFocus={() => setFocused("image")}
                onBlur={() => setFocused("")}
                style={{ ...styles.input, ...(focused === "image" ? styles.inputFocus : {}), flex: 1 }}
              />
              <button type="button" onClick={fillSampleImage} style={styles.smallBtn} title="Fill sample image">
                Sample
              </button>
            </div>
          </>
        ) : (
          <>
            <label style={styles.label} htmlFor="watch-image-file">Select Image File</label>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* hidden native input */}
              <input
                ref={fileInputRef}
                id="watch-image-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                  pointerEvents: "none"
                }}
              />

              {/* visible custom button */}
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                style={styles.fileButton}
              >
                <span aria-hidden>📁</span>
                <span style={{ fontSize: 14, color: "#111827" }}>
                  {imageFile ? "Change file" : "Choose file"}
                </span>
              </button>

              {/* filename display */}
              <div style={styles.fileName}>
                {imageFile ? imageFile.name : "No file selected"}
              </div>

              {/* clear button */}
              {imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreviewUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  style={styles.smallBtn}
                >
                  Clear
                </button>
              )}
            </div>
          </>
        )}

        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Preview" style={styles.imagePreview} onError={(e) => (e.currentTarget.style.display = "none")} />
          ) : (
            <div style={{ ...styles.imagePreview, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 12 }}>
              No image
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={styles.hint}>
              {imageMode === "url"
                ? "Provide a full image URL. Preview updates as you type."
                : "Select an image file (max 5 MB). Preview generated locally."}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={addWatch}
        disabled={submitting}
        style={{
          ...styles.primaryBtn,
          opacity: submitting ? 0.8 : 1,
          cursor: submitting ? "progress" : "pointer"
        }}
      >
        {submitting ? "Adding…" : "Add Watch"}
      </button>

      {status && (
        <div style={{ marginTop: 12 }}>
          <span style={status.type === "success" ? styles.success : styles.error}>{status.msg}</span>
        </div>
      )}

      <p style={styles.secondaryText}>
        Tip: Press Enter to submit the form. Price accepts numbers with up to two decimals.
      </p>
    </div>
  );
}
