// pages/index.js
import useSWR from 'swr';
import axios from 'axios';
import React from 'react';

const fetcher = url => axios.get(url).then(r => r.data);

function WatchCard({ watch }) {
  const img = watch.images && watch.images.length ? watch.images[0] : '/placeholder.png';
  return (
    <div style={{
      border: '1px solid #eee',
      borderRadius: 8,
      padding: 12,
      width: 260,
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
    }}>
      <img src={img} alt={`${watch.brand} ${watch.model}`} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }} />
      <h3 style={{ margin: '8px 0' }}>{watch.brand} {watch.model}</h3>
      <p style={{ margin: 0, fontWeight: 700 }}>{watch.currency} {watch.price}</p>
      <p style={{ color: '#666', fontSize: 13 }}>{watch.condition}</p>
    </div>
  );
}

export default function Home() {
  const { data, error } = useSWR('/api/watches', fetcher);

  if (error) return <div style={{ padding: 20 }}>Failed to load: {error.message}</div>;
  if (!data) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Watch Marketplace</h1>
        <div>
          <a href="/admin">Admin</a>
        </div>
      </header>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {data.items.map(w => <WatchCard watch={w} key={w._id} />)}
      </div>
    </div>
  );
}
