import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { manageInventoryAction, fetchStockStatusAction, fetchLowStockItems } from "../redux/action/inventoryAction"; // Import fetchLowStockItems
import { useNavigate, useParams } from "react-router-dom";
import { selectInventoryLoading, selectInventoryError, selectInventoryMessage, selectGetAllInventorys, selectStockStatus } from "../redux/selector/selector";

const ManageInventory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { sku } = useParams();
    const [stockType, setStockType] = useState(''); 
    const [formData, setFormData] = useState({
        sku: "",
        stock: "",
        reorder_level: "",
        stock_type: ""
    });

    const [validationErrors, setValidationErrors] = useState({});
    const loading = useSelector(selectInventoryLoading);
    const error = useSelector(selectInventoryError);
    const message = useSelector(selectInventoryMessage);
    const inventories = useSelector(selectGetAllInventorys); 
    const stockStatus = useSelector(selectStockStatus);

    const stockTypeMapping = {
        1: "Stock In",
        2: "Stock Out"        
    };

    useEffect(() => {
        dispatch(fetchStockStatusAction()); 
    }, [dispatch]);

    useEffect(() => {
        const inventory = inventories.find(i => i.sku === sku);
        if (inventory) {
            setFormData({
                sku: inventory.sku,
                stock: inventory.stock,
                reorder_level: inventory.reorder_level,
                stock_type: inventory.stock_type || ''
            });
        }
    }, [inventories, sku]);

    const validateForm = () => {
        const errors = {};
        if (!formData.sku.trim()) {
            errors.sku = "Inventory SKU is required";
        }
        if (!formData.reorder_level) {
            errors.reorder_level = "Inventory reorder level is required";
        }
        if (!formData.stock) {
            errors.stock = "Inventory stock is required";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleStockTypeChange = (e) => {
        const selectedStockType = e.target.value;
        setStockType(selectedStockType);
        setFormData({ ...formData, stock_type: selectedStockType });
    };

    const handleStockAmountChange = (e) => {
        const amount = e.target.value;
        setFormData(prev => ({ ...prev, stock: amount }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        if (!validateForm()) return;
        
        const inventoryData = new FormData();
        inventoryData.append('sku', formData.sku);
        inventoryData.append('stock', formData.stock);
        inventoryData.append('reorder_level', formData.reorder_level);
        inventoryData.append('stock_type', formData.stock_type); 
        
        await dispatch(manageInventoryAction(inventoryData));
        dispatch(fetchLowStockItems());
    };

    const standardFields = [
        { id: "sku", name: "sku", type: "text", label: "SKU:", placeholder: "Enter SKU", readOnly: true },
        { id: "reorder_level", name: "reorder_level", type: "number", label: "Inventory Reorder Level:", placeholder: "Enter inventory reorder level" },
    ];

    const renderField = ({ id, name, type, label, placeholder, readOnly }) => {
        const hasError = !!validationErrors[name];
        const commonProps = {
            id, name, value: formData[name], onChange: handleInputChange,
            className: `border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`,
            disabled: loading, placeholder, readOnly
        };

        return (
            <div className="mb-6" key={id}>
                <label htmlFor={id} className="block mb-2 text-gray-700 font-medium">{label}</label>
                <input type={type} {...commonProps} />
                {hasError && <p className="text-red-500 text-sm mt-2">{validationErrors[name]}</p>}
                {error && !Object.values(validationErrors).some(Boolean) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        <strong className="font-bold">Error: </strong>
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden m-6">
            <div className="bg-gray-800 py-4 px-6 border-b">
                <h2 className="text-2xl font-bold text-white">Manage Inventory</h2>
            </div>
            <div className="p-6">
                {loading && <div className="text-blue-500 text-center mb-6 py-2 bg-blue-50 rounded-md"><span className="font-medium">Loading...</span></div>}
                {error && !Object.values(validationErrors).some(Boolean) && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"><strong className="font-bold">Error: </strong><span>{error}</span></div>}
                {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6"><strong className="font-bold">Success: </strong><span>{message}</span></div>}
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="mb-6">
                        <label htmlFor="stock_type" className="block mb-2 text-gray-700 font-medium">Stock Status</label>
                        <select id="stock_type" name="stock_type" value={formData.stock_type} onChange={handleStockTypeChange} className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Stock Status</option>
                            {stockStatus.map(status => (
                                <option key={status.id} value={status.stock_type}>
                                    {stockTypeMapping[status.id] || status.stock_type}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formData.stock_type && (
                        <div className="mb-6">
                            <label htmlFor="stock" className="block mb-2 text-gray-700 font-medium">Stock Amount</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleStockAmountChange} className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter stock amount" />
                        </div>
                    )}
                    <div className="mb-6 mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Inventory Details</h3>
                        {standardFields.map(renderField)}
                    </div>
                    <div className="pt-4 border-t">
                        <button type="submit" className="w-full bg-gray-700 text-white p-3 rounded-md hover:bg-gray-800 transition duration-200 font-medium text-lg" disabled={loading}>
                            {loading ? 'Updating Inventory...' : 'Update Inventory'}
                        </button>
                        <div className="mt-4 text-center">
                            <button type="button" className="text-gray-700 hover:text-gray-800 font-medium" onClick={() => navigate('/dashboard/view-product')}>Back to Inventories</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageInventory;
