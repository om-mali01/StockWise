import React, { useState, useEffect } from "react";
import { loginAction } from "../redux/action/loginAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectLoading, selectError, selectMessage, selectUserRole, selectIsAuthenticated } from "../redux/selector/selector";

const Login = () => {
    const [formData, setFormData] = useState({ user_name: "", password: "" });
    const [errors, setErrors] = useState({});
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const error = useSelector(selectError);
    const message = useSelector(selectMessage);
    const userRole = useSelector(selectUserRole);

    useEffect(() => {
        if (error) {
            if (error.includes("User not found") || error.includes("Invalid username")) {
                setErrors({...errors, user_name: "Invalid username, please try again."});
            } else if (error.includes("Incorrect password")) {
                setErrors({...errors, password: "Wrong password. Please check and try again."});
            }
        }
    }, [error]);

    useEffect(() => {
        if (isAuthenticated && userRole) {
            console.log("userRole: ",userRole);
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, userRole, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
        if (errors[name]) {
            setErrors({...errors, [name]: ""});
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!formData.user_name.trim()) newErrors.user_name = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        dispatch(loginAction(formData));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-gray-800 py-4 px-6 border-b">
                    <h2 className="text-2xl font-bold text-white">Login</h2>
                </div>
                
                <div className="p-6">
                    {loading && <div className="text-blue-500 text-center mb-4 py-2 bg-blue-50 rounded">Loading...</div>}
                    {message && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4">{message}</div>}
                    {error && !errors.user_name && !errors.password && 
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">{error}</div>}
                    
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label htmlFor="user_name" className="block mb-2 font-medium text-gray-700">Username:</label>
                            <input
                                type="text"
                                id="user_name"
                                name="user_name"
                                value={formData.user_name}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className={`border ${errors.user_name ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded focus:ring-2 focus:ring-blue-500`}
                                disabled={loading}
                            />
                            {errors.user_name && <p className="text-red-500 text-sm mt-1">{errors.user_name}</p>}
                        </div>
                
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded focus:ring-2 focus:ring-blue-500`}
                                disabled={loading}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-gray-700 text-white p-3 rounded hover:bg-gray-800 transition font-medium text-lg"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;