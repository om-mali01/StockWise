import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa'; 

const Sidebar = ({ roleButtons, lowStockProducts }) => {
  return (
    <div className="w-64 overflow-hidden bg-gray-800 shadow-lg p-4">
      <h2 className="text-xl text-white font-bold mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-2">
        {roleButtons.map(({ to, text }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 
              `w-full text-left px-4 py-2 rounded-lg transition duration-300 ${
                isActive ? 'bg-gray-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-700'
              }`
            }
          >
            {text}
          </NavLink>
        ))}
      </nav>
      
      {/* Low Stock Notification Section */}
      <div className="mt-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg text-yellow-400 font-bold mb-2 flex items-center">
          <FaExclamationTriangle className="mr-2" /> Low Stock Alerts
        </h3>
        {lowStockProducts.length > 0 ? (
          <ul className="text-gray-200">
            {lowStockProducts.map(product => (
              <li key={product.item_id} className="flex justify-between mb-1 p-2 bg-gray-600 rounded-lg">
                <span>{product.item_name}</span>
                <span className="font-bold text-red-400">{product.current_stock}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No low stock products.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
