import { useEffect, useState } from "react";

export default function Home() {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    fetch("/api/watches")
      .then(res => res.json())
      .then(data => setWatches(data));
  }, []);

  return (
    <div className="container">
      <h1>Watch Marketplace</h1>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {watches.map(w => (
          <div className="card" key={w._id}>
            <img src={w.image || "/placeholder.png"} />
            <h3>{w.name}</h3>
            <p>₹{w.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
