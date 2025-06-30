import React, { useState, useEffect } from "react";
import { addUserAction, fetchUserRoleAction } from "../redux/action/loginAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectError, selectLoading, selectMessage, selectRoles } from "../redux/selector/selector";

const AddUser = () => {
    const [formData, setFormData] = useState({
        user_name: "",
        name: "",
        email: "",
        mobile_no: "",
        password: "",
        role: ""
    });
    const [errors, setErrors] = useState({});
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const message = useSelector(selectMessage);
    const roles = useSelector(selectRoles);

    const roleLabelMapping = {
        inventory_manager: "Inventory Manager",
        warehouse_staff: "Warehouse Staff"        
    };

    useEffect(() => {
        dispatch(fetchUserRoleAction());
    }, [dispatch]);

    useEffect(() => {
        if (error && error.includes("Username already exists")) {
            setErrors(prev => ({
                ...prev,
                user_name: "Username already exists. Please choose a different username."
            }));
        }
    }, [error]);

    useEffect(() => {
        if (message && message.includes("User added successfully")) {
            setTimeout(() => navigate('/dashboard'), 2000);
        }
    }, [message, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        dispatch(addUserAction({...formData}));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.user_name.trim()) {
            newErrors.user_name = "Username is required";
        } else if (formData.user_name.length < 3) {
            newErrors.user_name = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.user_name)) {
            newErrors.user_name = "Username can only contain letters, numbers, and underscores";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.mobile_no.trim()) {
            newErrors.mobile_no = "Mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobile_no)) {
            newErrors.mobile_no = "Please enter a valid 10-digit mobile number";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password should contain at least two of: uppercase, lowercase, numbers";
        }

        if (!formData.role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    
    const renderField = (id, name, type, label, placeholder, options = null) => {
        const hasError = !!errors[name];
        
        return (
            <div className="mb-6 text-[16px]" key={id}>
                <label htmlFor={id} className="block mb-2 text-gray-800">{label}</label>
                
                {type === "select" ? (
                    <select
                        id={id}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        className={`border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:ring-2 focus:ring-gray-500`}
                        disabled={loading}
                    >
                        <option value="">Select {label.replace(':', '')}</option>
                        {options && options.map(option => (
                            <option key={option.id || option.value} value={option.value}>
                                {roleLabelMapping[option.value] || option.value}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500`}
                        disabled={loading}
                    />
                )}
                
                {hasError && <p className="text-red-500 text-sm mt-2">{errors[name]}</p>}
            </div>
        );
    };

    return (
    
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden m-6">
            <div className="bg-gray-800 py-4 px-6 border-b">
                <h2 className="font-bold text-white">Add New User</h2>
            </div>
            
            <div className="p-6">
                {loading && (
                    <div className="text-blue-500 text-center mb-6 py-2 bg-blue-50 rounded-md">
                        <span className="">Loading...</span>
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
                    {renderField("user_name", "user_name", "text", "Username:", "Enter Username")}
                    {renderField("name", "name", "text", "Name:", "Enter name")}
                    {renderField("email", "email", "email", "Email:", "Enter email")}
                    {renderField("mobile_no", "mobile_no", "text", "Mobile No:", "Enter mobile no")}
                    {renderField("password", "password", "password", "Password:", "Enter password")}
                    {renderField(
                        "role", 
                        "role", 
                        "select", 
                        "Role:", 
                        null, 
                        Array.isArray(roles) ? roles.map(role => ({ id: role.id, value: role.role })) : []
                    )}
              
                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            className="w-full bg-gray-700 text-white p-3 rounded-md hover:bg-gray-800 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Adding User...' : 'Add User'}
                        </button>
                        
                        <div className="mt-4 text-center">
                            <button 
                                type="button" 
                                className="text-gray-700 hover:text-gray-800"
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

export default AddUser;