// client/src/components/WatchCard.js
import React from 'react';

const WatchCard = ({ watch }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={watch.image || '/placeholder-watch.jpg'} 
          alt={`${watch.brand} ${watch.model}`}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${watch.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{watch.brand}</h3>
            <p className="text-gray-400">{watch.model}</p>
          </div>
          <span className="bg-gray-700 text-xs px-2 py-1 rounded-full capitalize">
            {watch.category}
          </span>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-300 text-sm line-clamp-2">{watch.description}</p>
        </div>
        
        {watch.metaTags && watch.metaTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {watch.metaTags.map((tag, index) => (
              <span key={index} className="bg-gray-700 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchCard;
