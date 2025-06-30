import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../redux/action/loginAction'; 
import { selectLoading, selectLowStockStatus } from '../redux/selector/selector';
import Sidebar from './sidebar'; 

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectLoading);
  const lowStockProducts = useSelector(selectLowStockStatus); 
  
  const userRole = localStorage.getItem("user_role") || "default";
  
  const roleButtons = {
    super_admin: [
      { to: "/dashboard/add-user", text: "Add User" },
      { to: "/dashboard/add-inventory", text: "Add Inventory" },
      { to: "/dashboard/view-product", text: "View Products" },
      { to: "/dashboard/show-users", text: "Show Users" },
    ],
    inventory_manager: [
      { to: "/dashboard/add-inventory", text: "Add Inventory" },
      { to: "/dashboard/view-product", text: "View Inventory" },
      { to: "/dashboard/show-users", text: "Show Users" },
    ],
    warehouse_staff: [
      { to: "/dashboard/view-product", text: "View Inventory" },
    ],
    default: [],
  }[userRole] || [];

  const handleLogout = async () => {
    try {
      await dispatch(logoutAction());
      navigate('/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar roleButtons={roleButtons} lowStockProducts={lowStockProducts} /> {/* Pass lowStockProducts here */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center p-6 bg-white shadow-sm border-b">
          <div>
            <h1 className="text-2xl text-black font-bold">Welcome to Dashboard!</h1>
            <p className="text-gray-600">Manage your products efficiently with the options on the left.</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
              isLoading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
