// client/src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WatchList from './components/WatchList';
import AddWatchForm from './components/AddWatchForm';
import SearchFilters from './components/SearchFilters';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [watches, setWatches] = useState([]);
  const [filteredWatches, setFilteredWatches] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    try {
      const response = await fetch('/api/watches');
      const data = await response.json();
      setWatches(data);
      setFilteredWatches(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching watches:', error);
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    setSearchParams(params);
    
    let filtered = watches;
    
    if (params.brand) {
      filtered = filtered.filter(watch => 
        watch.brand.toLowerCase().includes(params.brand.toLowerCase())
      );
    }
    
    if (params.model) {
      filtered = filtered.filter(watch => 
        watch.model.toLowerCase().includes(params.model.toLowerCase())
      );
    }
    
    if (params.minPrice) {
      filtered = filtered.filter(watch => watch.price >= params.minPrice);
    }
    
    if (params.maxPrice) {
      filtered = filtered.filter(watch => watch.price <= params.maxPrice);
    }
    
    if (params.category) {
      filtered = filtered.filter(watch => watch.category === params.category);
    }
    
    if (params.metaTag) {
      filtered = filtered.filter(watch => 
        watch.metaTags && watch.metaTags.includes(params.metaTag)
      );
    }
    
    setFilteredWatches(filtered);
  };

  const handleAddWatch = async (watchData) => {
    try {
      const response = await fetch('/api/watches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(watchData),
      });
      
      if (response.ok) {
        const newWatch = await response.json();
        setWatches([...watches, newWatch]);
        setFilteredWatches([...watches, newWatch]);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding watch:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      
      {!isAdmin ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Time Keeper</h1>
          
          <SearchFilters onSearch={handleSearch} />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <WatchList watches={filteredWatches} />
          )}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition duration-300"
            >
              {showAddForm ? 'Cancel' : '+ Add Watch'}
            </button>
          </div>
          
          {showAddForm && (
            <AddWatchForm onSubmit={handleAddWatch} onCancel={() => setShowAddForm(false)} />
          )}
          
          <SearchFilters onSearch={handleSearch} />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <WatchList watches={filteredWatches} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
