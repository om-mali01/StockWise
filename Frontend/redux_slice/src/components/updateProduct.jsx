import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProductAction, fetchCategories, fetchSubcategories, getInventoriesAction } from "../redux/action/inventoryAction";
import { useNavigate, useParams } from "react-router-dom";
import { selectInventoryLoading, selectInventoryError, selectInventoryMessage, selectCategories, selectSubcategories, selectGetAllInventorys, selectStockStatus } from "../redux/selector/selector";
const UpdateProduct = () => {
    const { sku } = useParams(); 
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [showNewSubcategory, setShowNewSubcategory] = useState(false);
    const [newCategory, setNewCategory] = useState(""); 
    const [newSubcategory, setNewSubcategory] = useState(""); 
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        sub_category: '',
        category_id: '',
        sub_category_id: '',
        description: '',
        price: '',
        image: null
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [skuError, setSkuError] = useState(null); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectInventoryLoading);
    const error = useSelector(selectInventoryError);
    const message = useSelector(selectInventoryMessage);
    const categories = useSelector(selectCategories);
    const sub_categories = useSelector(selectSubcategories);
    const inventories = useSelector(selectGetAllInventorys); 
    
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(getInventoriesAction());
    }, [dispatch]);

    useEffect(() => {
        const product = inventories.find(i => i.sku === (sku));
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                sub_category: product.sub_category,
                sku: product.sku,
                description: product.description,
                price: product.price,
                image: product.image,
            });
        }
    }, [inventories, sku]);
    
    useEffect(() => {
        if (formData.category_id && !showNewCategory) {
            dispatch(fetchSubcategories(formData.category_id));
        }
    }, [formData.category_id, showNewCategory, dispatch]);

    useEffect(() => {
        if (error) {
            setSkuError(error);
        } else {
            setSkuError(null); 
        }
    }, [error]); 
    
    const validateForm = () => {
        const errors = {};

        if (showNewCategory && !formData.category.trim()) {
            errors.category = "New category name is required";
        }
        if (showNewSubcategory && !formData.sub_category.trim()) {
            errors.sub_category = "New subcategory name is required";
        }

        if (!showNewCategory && !formData.category_id) {
            errors.category_id = "Product category is required";
        }
        if (!showNewSubcategory && !formData.sub_category_id && !showNewCategory) {
            errors.sub_category_id = "Product subcategory is required";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        if (!validateForm()) return;
        const productData = new FormData();
        productData.append('name', formData.name);
        productData.append('category', showNewCategory ? newCategory : formData.category);
        productData.append('sub_category', showNewSubcategory ? newSubcategory : formData.sub_category);
        productData.append('description', formData.description);
        productData.append('price', formData.price);
        if (formData.image) {
            productData.append('image', formData.image);
        }
        dispatch(updateProductAction(formData.sku, productData));
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

    const standardFields = [
        { id: "name", name: "name", type: "text", label: "Product Name:", placeholder: "Enter product name" },
        { id: "sku", name: "sku", type: "text", label: "SKU:", placeholder: "SKU is read-only", readOnly: true },
        { id: "price", name: "price", type: "number", label: "Product Price:", placeholder: "Enter product price" },
        { id: "description", name: "description", type: "textarea", label: "Description:", placeholder: "Enter product description", rows: "4" },
        { id: "image", name: "image", type: "file", label: "Product image:", placeholder: "Add product image" },
    ];

    const renderField = ({ id, name, type, label, placeholder, readOnly, ...props }) => {
        const hasError = !!validationErrors[name];
        const commonProps = {
            id, name, value: formData[name], onChange: handleInputChange,
            className: `border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`,
            disabled: loading, placeholder, readOnly, ...props
        };

        return (
            <div className="mb-6" key={id}>
                <label htmlFor={id} className="block mb-2 text-gray-700 font-medium">{label}</label>
                {type === "file" ? (
                    <input type={type} onChange={handleInputChange} className={`border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} disabled={loading} />
                ) : (
                    <input type={type} {...commonProps} />
                )}
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

    const getSubcategoryId = (subcategory) => {
        return subcategory.subcategory_id || subcategory.id || subcategory.sub_category_id;
    };

    const getSubcategoryName = (subcategory) => {
        return subcategory.subcategory_name || subcategory.name || subcategory.sub_category_name;
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden m-6">
            <div className="bg-gray-800 py-4 px-6 border-b">
                <h2 className="text-2xl font-bold text-white">Update Product</h2>
            </div>
            <div className="p-6">
                {loading && <div className="text-blue-500 text-center mb-6 py-2 bg-blue-50 rounded-md"><span className="font-medium">Loading...</span></div>}
                {error && !Object.values(validationErrors).some(Boolean) && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"><strong className="font-bold">Error: </strong><span>{error}</span></div>}
                {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6"><strong className="font-bold">Success: </strong><span>{message}</span></div>}
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <label htmlFor="category_id" className="text-gray-700 font-medium text-lg">Category</label>
                            <button type="button" className="px-3 py-1 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-md transition-colors" onClick={toggleCategory}>
                                {showNewCategory ? "Select Existing" : "Add New Category"}
                            </button>
                        </div>
                        <div className="mt-3">
                            {showNewCategory ? (
                                <input id="category" name="category" type="text" value={formData.category} onChange={handleInputChange} className={`border ${validationErrors.category ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} disabled={loading} placeholder="Enter new category name" />
                            ) : (
                                <select id="category_id" name="category_id" value={formData.category_id} onChange={handleInputChange} className={`border ${validationErrors.category_id ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`} disabled={loading}>
                                    <option value="">Select a category</option>
                                    {categories.map(category => (
                                        <option key={category.category_id.toString()} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {validationErrors.category_id && !showNewCategory && <p className="text-red-500 text-sm mt-2">{validationErrors.category_id}</p>}
                            {validationErrors.category && showNewCategory && <p className="text-red-500 text-sm mt-2">{validationErrors.category}</p>}
                        </div>
                    </div>
                    <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <label htmlFor="sub_category_id" className="text-gray-700 font-medium text-lg">Subcategory</label>
                            <button type="button" className={`px-3 py-1 text-sm font-medium text-white bg-gray-500 hover:bg-gray-700 rounded-md transition-colors ${showNewCategory ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={toggleSubcategory} disabled={showNewCategory}>
                                {showNewSubcategory ? "Select Existing" : "Add New Subcategory"}
                            </button>
                        </div>
                        <div className="mt-3">
                            {showNewSubcategory || showNewCategory ? (
                                <input id="sub_category" name="sub_category" type="text" value={formData.sub_category} onChange={handleInputChange} className={`border ${validationErrors.sub_category ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} disabled={loading} placeholder="Enter new subcategory name" />
                            ) : (
                                <select id="sub_category_id" name="sub_category_id" value={formData.sub_category_id} onChange={handleInputChange} className={`border ${validationErrors.sub_category_id ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${!formData.category_id ? 'opacity-50' : ''}`} disabled={loading || !formData.category_id}>
                                    <option value="">Select a subcategory</option>
                                    {sub_categories.map(subcategory => {
                                        const id = getSubcategoryId(subcategory);
                                        const name = getSubcategoryName(subcategory);
                                        return (
                                            <option key={id.toString()} value={id}>
                                                {name}
                                            </option>
                                        );
                                    })}
                                </select>
                            )}
                            {validationErrors.sub_category_id && !showNewSubcategory && !showNewCategory && <p className="text-red-500 text-sm mt-2">{validationErrors.sub_category_id}</p>}
                            {validationErrors.sub_category && (showNewSubcategory || showNewCategory) && <p className="text-red-500 text-sm mt-2">{validationErrors.sub_category}</p>}
                        </div>
                    </div>
                    <div className="mb-6 mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Product Details</h3>
                        {standardFields.map(renderField)}
                    </div>
                    <div className="pt-4 border-t">
                        <button type="submit" className="w-full bg-gray-700 text-white p-3 rounded-md hover:bg-gray-800 transition duration-200 font-medium text-lg" disabled={loading}>
                            {loading ? 'Updating Product...' : 'Update Product'}
                        </button>
                        <div className="mt-4 text-center">
                            <button type="button" className="text-gray-700 hover:text-gray-800 font-medium" onClick={() => navigate('/dashboard/view-product')}>Back to Products</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;