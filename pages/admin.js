import { useState } from "react";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [form, setForm] = useState({ name: "", price: "", image: "" });

  const login = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    if (data.success) setLoggedIn(true);
    else alert("Incorrect admin password");
  };

  const addWatch = async () => {
    await fetch("/api/watches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Watch added!");
    setForm({ name: "", price: "", image: "" });
  };

  if (!loggedIn)
    return (
      <div className="container">
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    );

  return (
    <div className="container">
      <h2>Add Watch</h2>

      <input
        placeholder="Watch Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      <button onClick={addWatch}>Add</button>
    </div>
  );
}
