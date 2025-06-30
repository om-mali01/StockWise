import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateUserAction, fetchUserRoleAction, getUserByUserNameAction } from "../redux/action/loginAction";
import { selectError, selectLoading, selectMessage, selectRoles, selectUserByUserName } from "../redux/selector/selector";

const UpdateUser   = () => {
    const { user_name } = useParams(); 
    const [formData, setFormData] = useState({
        user_id: "", 
        user_name: "",
        name: "",
        email: "",
        phone_number: "",
        role: ""
    });
    const [errors, setErrors] = useState({});
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const message = useSelector(selectMessage);
    const roles = useSelector(selectRoles);
    const user = useSelector(state => selectUserByUserName(state, user_name)); 

    useEffect(() => {
        console.log("User  Name from URL:", user_name); 
        dispatch(fetchUserRoleAction());
        dispatch(getUserByUserNameAction(user_name)); 
    }, [dispatch, user_name]);

    useEffect(() => {
        if (user) {
            console.log("Fetched User Data:", user);
            setFormData({
                user_id: user.user_id, 
                user_name: user.user_name,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number, 
                role: user.role 
            });
        } else {
            console.log("User  data is not available yet."); 
        }
    }, [user]);

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
        console.log("Submitting user data:", formData); 
        dispatch(updateUserAction(formData)); 
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.user_name.trim()) {
            newErrors.user_name = "Username is required";
        }
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "Mobile number is required";
        }
        if (!formData.role) {
            newErrors.role = "Role is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const renderField = (id, name, type, label, placeholder, readOnly = false) => {
        const hasError = !!errors[name];
        
        return (
            <div className="mb-6" key={id}>
                <label htmlFor={id} className="block mb-2 text-gray-800">{label}</label>
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:ring-2 focus:ring-gray-500`}
                    disabled={loading}
                    readOnly={readOnly}
                />
                {hasError && <p className="text-red-500 text-sm mt-2">{errors[name]}</p>}
            </div>
        );
    };

    const renderSelectField = (id, name, label, options) => {
        const hasError = !!errors[name];

        return (
            <div className="mb-6" key={id}>
                <label htmlFor={id} className="block mb-2 text-gray-800">{label}</label>
                <select
                    id={id}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className={`border ${hasError ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:ring-2 focus:ring-gray-500`}
                    disabled={loading}
                >
                    <option value="">Select {label.replace(':', '')}</option>
                    {options.map(option => (
                        <option key={option.id} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {hasError && <p className="text-red-500 text-sm mt-2">{errors[name]}</p>}
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden m-6">
            <div className="bg-gray-800 py-4 px-6 border-b">
                <h2 className="font-bold text-white">Update User</h2>
            </div>
            <div className="p-6">
                {loading && (
                    <div className="text-blue-500 text-center mb-6 py-2 bg-blue-50 rounded-md">
                        <span className="">Loading...</span>
                    </div>
                )}
                {error && (
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
                    {renderField("user_id", "user_id", "text", "User   ID:", "User   ID", true)} 
                    {renderField("user_name", "user_name", "text", "Username:", "Enter Username", true)} 
                    {renderField("name", "name", "text", "Name:", "Enter name")}
                    {renderField("email", "email", "email", "Email:", "Enter email")}
                    {renderField("phone_number", "phone_number", "text", "Phone Number:", "Enter phone no")}
                    {renderSelectField("role", "role", "Role:", roles.map(role => ({ id: role.id, value: role.role, label: role.role })))}
                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            className="w-full bg-gray-700 text-white p-3 rounded-md hover:bg-gray-800 transition duration-200"
                            disabled={loading}
                        >
                            {loading ? 'Updating User...' : 'Update User'}
                        </button>
                        <div className="mt-4 text-center">
                            <button 
                                type="button" 
                                className="text-gray-700 hover:text-gray-800"
                                onClick={() => navigate('/dashboard/show-users')}
                            >
                                Back to Users
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUser  ;
