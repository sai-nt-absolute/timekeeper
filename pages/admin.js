// pages/admin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function setAuthToken(token) {
  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete axios.defaults.headers.common['Authorization'];
}

export default function Admin() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('adminW123');
  const [token, setToken] = useState(null);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    brand: '', model: '', price: '', currency: 'USD', images: '', metaTags: '', condition: 'new'
  });

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    if (t) {
      setToken(t);
      setAuthToken(t);
    }
  }, []);

  async function login(e) {
    e.preventDefault();
    setMsg('');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const t = res.data.token;
      setToken(t);
      localStorage.setItem('admin_token', t);
      setAuthToken(t);
      setMsg('Logged in.');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  }

  async function addWatch(e) {
    e.preventDefault();
    setMsg('');
    try {
      const payload = {
        brand: form.brand, model: form.model,
        price: Number(form.price),
        currency: form.currency,
        images: form.images ? form.images.split(',').map(s => s.trim()) : [],
        metaTags: form.metaTags ? form.metaTags.split(',').map(s => s.trim()) : [],
        condition: form.condition
      };
      const res = await axios.post('/api/watches', payload);
      setMsg('Created watch: ' + res.data._id);
      setForm({ brand: '', model: '', price: '', currency: 'USD', images: '', metaTags: '', condition: 'new' });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Create failed');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>

      {!token ? (
        <div style={{ maxWidth: 420 }}>
          <form onSubmit={login}>
            <div>
              <label>Email</label><br />
              <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <label>Password</label><br />
              <input value={password} type="password" onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 10 }}>
              <button type="submit">Login</button>
            </div>
          </form>
          <p style={{ color: '#666' }}>Seeded admin (if first run): admin@example.com / adminW123</p>
        </div>
      ) : (
        <div style={{ maxWidth: 700 }}>
          <p style={{ color: 'green' }}>Authenticated as admin.</p>
          <form onSubmit={addWatch}>
            <div>
              <input placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <input placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <input placeholder="Images (comma separated URLs)" value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <input placeholder="Meta tags (comma separated)" value={form.metaTags} onChange={e => setForm({ ...form, metaTags: e.target.value })} style={{ width: '100%' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                <option value="new">new</option>
                <option value="used">used</option>
              </select>
            </div>
            <div style={{ marginTop: 10 }}>
              <button type="submit">Create Watch</button>
            </div>
          </form>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => { localStorage.removeItem('admin_token'); setToken(null); setAuthToken(null); setMsg('Logged out'); }}>Logout</button>
          </div>
        </div>
      )}

      <p style={{ marginTop: 12, color: '#333' }}>{msg}</p>
    </div>
  );
}
