import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProtectedRoute from './components/protectedRoute';
import Login from './components/login';
import HomePage from './components/home';
import './App.css';
import Dashboard from './components/dashboard';
import AddUser  from './components/addUser';
import AddInventory from './components/addInventory';
import ViewProduct from './components/seeProducts';
import InventoryDetails from './components/inventoryDetails';
import DeleteInventory from './components/deleteInventory';
import UpdateProduct from './components/updateProduct';
import ManageInventory from './components/manageInventory';
import EditOptions from './components/editInventoryOptions';
import ShowUsers from './components/showUsers';
import UpdateUser  from './components/updateUser'; 
import LowStockStatus from './components/lowStockStatus';
import { initializeAuth } from './redux/action/loginAction'; 
import DeleteUser from './components/deleteUser';
import TransactionDetails from './components/transactionDetails';
import TransactionAnalytics from './components/transactionGraph';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route path="/dashboard/add-user" element={<AddUser  />} />
          <Route path="/dashboard/add-inventory" element={<AddInventory />} />
          <Route path="/dashboard/view-product" element={<ViewProduct />} />
          <Route path="/dashboard/view-product/:category" element={<ViewProduct />} /> 
          <Route path="/dashboard/show-users" element={<ShowUsers />} />
          <Route path="/dashboard/inventory-details/:sku" element={<InventoryDetails />} />
          <Route path="/dashboard/view-product/edit-options/delete-inventory/:sku" element={<DeleteInventory />} />
          <Route path="/dashboard/view-product/edit-options/update-product/:sku" element={<UpdateProduct />} />
          <Route path="/dashboard/view-product/edit-options/manage-inventory/:sku" element={<ManageInventory />} />
          <Route path="/dashboard/view-product/edit-options/:sku" element={<EditOptions />} />
          <Route path="/dashboard/show-users/update-user/:user_name" element={<UpdateUser  />} />
          <Route path="/dashboard/low-stock-status" element={<LowStockStatus />} />
          <Route path="/dashboard/show-users/delete-user/:user_name" element={<DeleteUser />} />
          <Route path="/dashboard/inventory-details/transaction/:sku" element={<TransactionDetails />} />
          <Route path="/dashboard/inventory-details/analytics/:sku" element={<TransactionAnalytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
