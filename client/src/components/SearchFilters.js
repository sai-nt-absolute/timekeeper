// client/src/components/SearchFilters.js
import React, { useState } from 'react';

const SearchFilters = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    category: '',
    metaTag: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input
            type="text"
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by brand"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input
            type="text"
            name="model"
            value={filters.model}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by model"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Min price"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Max price"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="diver">Diver's Watch</option>
            <option value="chronograph">Chronograph</option>
            <option value="dress">Dress Watch</option>
            <option value="sport">Sport Watch</option>
            <option value="smart">Smart Watch</option>
            <option value="luxury">Luxury Watch</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Meta Tag</label>
          <input
            type="text"
            name="metaTag"
            value={filters.metaTag}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by meta tag"
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition duration-300"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
