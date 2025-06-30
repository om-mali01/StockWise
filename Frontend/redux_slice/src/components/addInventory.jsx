import React, { useState, useEffect } from "react";
import { selectCategories, selectSubcategories, selectInventoryMessage, selectInventoryError, selectInventoryLoading } from "../redux/selector/selector";
import { addInventoryAction, fetchCategories, fetchSubcategories } from "../redux/action/inventoryAction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AddInventory = () => {
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [showNewSubcategory, setShowNewSubcategory] = useState(false);
    const [newCategory, setNewCategory] = useState(""); 
    const [newSubcategory, setNewSubcategory] = useState(""); 
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        sub_category: "",
        category_id: '',
        sub_category_id: '',
        sku: "",
        description: "",
        price: "",
        image: null
    });
    const [errors, setErrors] = useState({});
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectInventoryLoading);
    const error = useSelector(selectInventoryError);
    const message = useSelector(selectInventoryMessage);
    const categories = useSelector(selectCategories); 
    const sub_categories = useSelector(selectSubcategories); 

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (formData.category_id && !showNewCategory) {
            dispatch(fetchSubcategories(formData.category_id));
        }
    }, [formData.category_id, showNewCategory, dispatch]);

    useEffect(() => {
        if (message && message.includes("Inventory added successfully")) {
            setTimeout(() => navigate('/dashboard/view-product'), 200);
        }
    }, [message, navigate]);

    const handleChange = (e) => {
        const { name, type, files, value } = e.target;

        if (type === "file") {
            if (files.length > 0) {
                setFormData(prev => ({ ...prev, image: files[0] }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (name === "category_id") {
            const selectedCategory = categories.find(category => category.category_id === Number(value));
            if (selectedCategory) {
                setFormData(prev => ({ ...prev, category: selectedCategory.category_name }));
            } else {
                setFormData(prev => ({ ...prev, category: '' }));
            }
        }

        if (name === "sub_category_id") {
            const selectedSubcategory = sub_categories.find(sub => sub.sub_category_id === Number(value));
            if (selectedSubcategory) {
                setFormData(prev => ({ ...prev, sub_category: selectedSubcategory.sub_category_name }));
            } else {
                setFormData(prev => ({ ...prev, sub_category: '' }));
            }
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!showNewCategory && !formData.category_id) {
            newErrors.category_id = "Item category is required";
        }
        if (!showNewSubcategory && !formData.sub_category_id) {
            newErrors.sub_category_id = "Item subcategory is required";
        }
        
        if (!formData.name.trim()) {
            newErrors.name = "Item name is required";
        }
        if (!formData.sku.trim()) {
            newErrors.sku = "Item SKU is required";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Item description is required";
        }
        if (!formData.price.trim()) {
            newErrors.price = "Item price is required";
        }
        if (!formData.image) {
            newErrors.image = "Item image is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
    
        if (!validateForm()) return;

        const inventoryData = new FormData();
        inventoryData.append("name", formData.name);
        inventoryData.append("category", showNewCategory ? newCategory : formData.category);
        inventoryData.append("sub_category", showNewSubcategory ? newSubcategory : formData.sub_category);
        inventoryData.append("sku", formData.sku);
        inventoryData.append("description", formData.description);
        inventoryData.append("price", formData.price);
        inventoryData.append("image", formData.image);
        
        dispatch(addInventoryAction(inventoryData));
    };

    const toggleCategory = () => {
        setShowNewCategory(prev => !prev);
        if (!showNewCategory) {
            setFormData(prev => ({ ...prev, category_id: '', sub_category_id: '', sub_category: '' }));
            setNewCategory(""); 
            setShowNewSubcategory(true);
        } else {
            setShowNewSubcategory(false);
        }
    };

    const toggleSubcategory = () => {
        setShowNewSubcategory(prev => !prev);
        if (!showNewSubcategory) {
            setFormData(prev => ({ ...prev, sub_category_id: '' }));
            setNewSubcategory(""); 
        }
    };

    const renderField = (id, name, type, label, placeholder, accept = null) => {
        const hasError = !!errors[name];
        
        return (
            <div className="mb-6" key={id}>
                <label htmlFor={id} className="block mb-2 text-gray-700 font-medium">{label}</label>
                
                {type === "textarea" ? (
                    <textarea
                        id={id}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500`}
                        disabled={loading}
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={name}
                        onChange={handleChange}
                        value={type !== "file" ? (formData[name] || "") : undefined}
                        accept={accept}
                        placeholder={placeholder}
                        className={`border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500`}
                        disabled={loading}
                    />
                )}
                
                {hasError && <p className="text-red-500 text-sm mt-2">{errors[name]}</p>}
            </div>
        );
    };
    const getSubcategoryId = (subcategory) => {
        return subcategory.subcategory_id || subcategory.id || subcategory.sub_category_id;
    };

    const getSubcategoryName = (subcategory) => {
        return subcategory.subcategory_name || subcategory.name || subcategory.sub_category_name;
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-xl text-[16px] rounded-lg m-6 overflow-hidden">
            <div className="bg-gray-800 py-4 px-6 border-b">
                <h2 className="text-2xl font-bold text-white">Add Inventory</h2>
            </div>
            
            <div className="p-6">
                {loading && (
                    <div className="text-blue-500 text-center mb-6 py-2 bg-blue-50 rounded-md">
                        <span className="font-medium">Loading...</span>
                    </div>
                )}
                
                {error && !Object.values(errors).some(Boolean) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        <strong className="font-bold">Error: </strong>
                        <span>{error}</span>
                    </div>
                )}
                
                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                        <strong className="font-bold">Success: </strong>
                        <span>{message}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <label htmlFor="category_id" className="text-gray-700 font-medium ">Category</label>
                            <button type="button" className="px-3 py-1 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-md transition-colors" onClick={toggleCategory}>
                                {showNewCategory ? "Select Existing" : "Add New Category"}
                            </button>
                        </div>
                        <div className="mt-3">
                            {showNewCategory ? (
                                <input
                                    id="new_category"
                                    name="new_category"
                                    type="text"
                                    value={newCategory} 
                                    onChange={(e) => setNewCategory(e.target.value)} 
                                    className={`border ${errors.new_category ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    disabled={loading}
                                    placeholder="Enter new category name"
                                />
                            ) : (
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className={`border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                                    disabled={loading}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category.category_id.toString()} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.category_id && !showNewCategory && <p className="text-red-500 text-sm mt-2">{errors.category_id}</p>}
                            {errors.new_category && showNewCategory && <p className="text-red-500 text-sm mt-2">{errors.new_category}</p>}
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex justify-between items-center mb-3">
                            <label htmlFor="sub_category_id" className="text-gray-700 font-medium ">Subcategory</label>
                            <button type="button" className="px-3 py-1 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-md transition-colors" onClick={toggleSubcategory}>
                                {showNewSubcategory ? "Select Existing" : "Add New Subcategory"}
                            </button>
                        </div>
                        <div className="mt-3">
                            {showNewSubcategory ? (
                                <input
                                    id="sub_category"
                                    name="sub_category"
                                    type="text"
                                    value={newSubcategory} 
                                    onChange={(e) => setNewSubcategory(e.target.value)} 
                                    className={`border ${errors.sub_category ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    disabled={loading}
                                    placeholder="Enter new subcategory name"
                                />
                            ) : (
                                <select
                                    id="sub_category_id"
                                    name="sub_category_id"
                                    value={formData.sub_category_id}
                                    onChange={handleChange}
                                    className={`border ${errors.sub_category_id ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${!formData.category_id ? 'opacity-50' : ''}`}
                                    disabled={loading || !formData.category_id}
                                >
                                    <option value="">Select a subcategory</option>
                                    {sub_categories.map(sub_category => {
                                        const id = getSubcategoryId(sub_category);
                                        const name = getSubcategoryName(sub_category);
                                        return (
                                            <option key={id.toString()} value={id}>
                                                {name}
                                            </option>
                                        );
                                    })}
                                </select>
                            )}
                            {errors.sub_category_id && !showNewSubcategory && <p className="text-red-500 text-sm mt-2">{errors.sub_category_id}</p>}
                            {errors.sub_category && showNewSubcategory && <p className="text-red-500 text-sm mt-2">{errors.sub_category}</p>}
                        </div>
                    </div>

                    {renderField("name", "name", "text", "Inventory Name:", "Enter Inventory name")}
                    {renderField("sku", "sku", "text", "SKU:", "Enter SKU")}
                    {renderField("price", "price", "number", "Price:", "Enter price")}
                    {renderField("description", "description", "textarea", "Description:", "Enter description")}
                    {renderField("image", "image", "file", "Image:", "Add Image")}

                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            className="w-full bg-gray-700 text-white p-3 rounded-md hover:bg-gray-800 transition duration-200 font-medium "
                            disabled={loading}
                        >
                            {loading ? 'Adding Inventory...' : 'Add Inventory'}
                        </button>
                        
                        <div className="mt-4 text-center">
                            <button 
                                type="button" 
                                className="text-gray-700 hover:text-gray-800 font-medium"
                                onClick={() => navigate('/dashboard')}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                        </div>
                    </form>
                    </div>
                    </div>
    );
};

export default AddInventory;