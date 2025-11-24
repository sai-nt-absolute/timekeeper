// client/src/components/Header.js (Keep this as-is)
import React from 'react';

const Header = ({ isAdmin, setIsAdmin }) => {
  const handleAdminLogin = () => {
    const password = prompt('Enter admin password:');
    if (password === 'adminW123') {
      setIsAdmin(true);
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">Time Keeper</h1>
        
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
            <li><a href="#" className="hover:text-blue-400 transition">Collection</a></li>
            <li><a href="#" className="hover:text-blue-400 transition">About</a></li>
          </ul>
        </nav>
        
        {!isAdmin && (
          <button 
            onClick={handleAdminLogin}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition duration-300"
          >
            Admin Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
