
import { useEffect, useState } from "react";

export default function Home() {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    fetch("/api/watches")
      .then(res => res.json())
      .then(data => setWatches(data));
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          ⌚ Timekeeper
        </h1>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {watches.map(w => (
            <div
              key={w._id}
              className="card bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
            >
              <div className="overflow-hidden rounded-lg">
                <img
                  src={w.image || "/placeholder.png"}
                  alt={w.name}
                  className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold mt-4 text-gray-700">{w.name}</h3>
              <p className="text-gray-500 text-sm">₹{w.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
