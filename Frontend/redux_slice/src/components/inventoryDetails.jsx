import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectGetAllInventorys } from '../redux/selector/selector'; 

const InventoryDetails = () => {
    const { sku } = useParams();
    const navigate = useNavigate(); // Initialize the navigate function
    const inventories = useSelector(selectGetAllInventorys);
    const inventory = inventories.find(item => item.sku === sku); 

    if (!inventory) {
        return <div className="text-center text-red-500 font-bold">Inventory not found.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto m-10 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-white text-center">{inventory.name}</h1>
            <div className="flex flex-col items-center mb-4">
                <img 
                    src={`http://172.17.109:8000${inventory.item_img}`} 
                    alt={inventory.name} 
                    className="max-w-2xl h-80 object-cover rounded-lg mb-4 shadow-md" 
                />
                <img
                    src={`http://172.17.0.109:8000${inventory.barcode_img}`}
                    alt={inventory.barcode_img}
                    className="w-50 h-40 object-cover rounded-lg mb-4 shadow-md"
                />
            </div>
            <div className="flex flex-col space-y-2 mb-4">
                <p className="text-white text-lg"><strong>SKU:</strong> {inventory.sku}</p>
                <p className="text-white text-lg"><strong>Description:</strong> {inventory.description}</p>
                <p className="text-white text-lg"><strong>Category:</strong> {inventory.category}</p>
                <p className="text-white text-lg"><strong>Subcategory:</strong> {inventory.subcategory}</p>
                <p className="text-white text-lg"><strong>Barcode:</strong> {inventory.barcode}</p>
                <p className="text-white text-lg"><strong>Price:</strong> ${inventory.price.toFixed(2)}</p>
                <p className="text-white text-lg"><strong>Stock:</strong> {inventory.stock}</p>
                <p className="text-white text-lg"><strong>Reorder Level:</strong> {inventory.reorder_level}</p>
            </div>
            
                <button 
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                    onClick={() => navigate(`/dashboard/inventory-details/transaction/${inventory.sku}`)} 
                >
                    Transaction Details
                </button>
        </div>
    );
};

export default InventoryDetails;
