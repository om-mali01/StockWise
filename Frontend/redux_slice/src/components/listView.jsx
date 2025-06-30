import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListView = ({ inventories, category }) => {
  const baseUrl = "http://172.17.0.109:8000"; 
  const navigate = useNavigate();
  
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  const handleCheckboxChange = (sku) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(sku)) {
        newSelected.delete(sku); 
      } else {
        newSelected.add(sku); 
      }
      return newSelected;
    });
  };

  const filteredInventories = category 
    ? inventories.filter(inventory => inventory.category === category) 
    : inventories;

  return (
    <div className="overflow-x-auto text-[16px]">
      <table className="w-full bg-white border border-gray-400 ">
        <thead>
          <tr>
            <th className="py-2 px-6 border-b-2">Select</th>
            <th className="py-2 px-6 border-b-2">Image</th>
            <th className="py-2 px-6 border-b-2">Name</th>
            <th className="py-2 px-6 border-b-2">Description</th>
            <th className="py-2 px-6 border-b-2">SKU</th>
            <th className="py-2 px-6 border-b-2">Barcode</th>
            <th className="py-2 px-6 border-b-2">Price</th>
            <th className="py-2 px-6 border-b-2">Stock</th>
            <th className="py-2 px-6 border-b-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventories.map((inventory) => (
            <tr key={inventory.product_id}>
              <td className="py-2 px-6 border-b-2">
                <input 
                  type="checkbox" 
                  checked={selectedProducts.has(inventory.sku)} 
                  onChange={() => handleCheckboxChange(inventory.sku)} 
                />
              </td>
              <td className="py-2 px-6 border-b-2">
                <img 
                  src={`${baseUrl}${inventory.item_img}`} 
                  alt={inventory.name}
                  className="w-16 h-16 object-cover" 
                />
              </td>
              <td className="py-2 px-6 border-b-2">{inventory.name}</td>
              <td className="py-2 px-6 border-b-2">{inventory.description}</td>
              <td className="py-2 px-6 border-b-2">{inventory.sku}</td>
              <td className="py-2 px-6 border-b-2">{inventory.barcode}</td>
              <td className="py-2 px-6 border-b-2">{inventory.price}</td>
              <td className="py-2 px-6 border-b-2">{inventory.stock}</td>
              <td className="py-2 px-6 border-b-2">
                <button className="bg-gray-800 text-white rounded-lg p-2 font-bold"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    navigate(`/dashboard/view-product/edit-options/${inventory.sku}`);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
