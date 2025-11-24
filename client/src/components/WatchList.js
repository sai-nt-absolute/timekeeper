// client/src/components/WatchList.js
import React from 'react';
import WatchCard from './WatchCard';

const WatchList = ({ watches }) => {
  if (watches.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">No watches found</h2>
        <p className="text-gray-400">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {watches.map(watch => (
        <WatchCard key={watch._id} watch={watch} />
      ))}
    </div>
  );
};

export default WatchList;
