import React from "react";
import { useNavigate } from "react-router-dom";

const InventoryCard = ({ inventory }) => {

    console.log(inventory,"fjhdsghjghjsdgfjsd")

    const navigate = useNavigate();

    
    const handleCardClick = () => {
        navigate(`/dashboard/inventory-details/${inventory.sku}`); 
    };

    const baseUrl = "http://172.17.0.109:8000"; 
    const imageUrl = `${baseUrl}${inventory.item_img}`; 

    return (
        <div className="w-full md:w-1/2 lg:w-1/3 text-[16px] p-3" onClick={handleCardClick}>
            <div className="bg-gray-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <img 
                    src={imageUrl} 
                    alt={inventory.name} 
                    className="p-8 w-56 h-64 justify-between items-center object-cover" 
                />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-white truncate">{inventory.name}</h3>
                        <button 
                            className="bg-gray-800 text-white rounded-lg p-1 font-bold"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                navigate(`/dashboard/view-product/edit-options/${inventory.sku}`);
                            }}
                        >
                            Edit
                        </button>
                    </div>
                    <div className="flex items-center mb-2">
                        <span className="text-white font-medium w-24">Description:</span>
                        <span className="text-gray-50">{inventory.description}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <span className="text-white font-medium w-24">SKU:</span>
                        <span className="text-gray-50">{inventory.sku}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <span className="text-white font-medium w-24">Barcode:</span>
                        <span className="text-gray-50">{inventory.barcode}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <span className="text-white font-medium w-24">Price:</span>
                        <span className="text-gray-50">{inventory.price}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <span className="text-white font-medium w-24">Stock:</span>
                        <span className="text-gray-50">{inventory.stock}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryCard;