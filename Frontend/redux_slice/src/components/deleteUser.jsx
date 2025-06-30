import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserAction } from "../redux/action/loginAction";
import { useNavigate, useParams } from "react-router-dom";
import { selectError, selectLoading, selectMessage } from "../redux/selector/selector";

const DeleteUser = () => {
    const { user_name } = useParams(); 
    const [validationErrors, setValidationErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const message = useSelector(selectMessage);

    useEffect(() => {
    }, [user_name]);

    const validateForm = () => {
        const errors = {};
        if (!user_name.trim()) {
            errors.user_name = "User's Username is required";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        dispatch(deleteUserAction(user_name));
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-xl text-[16px] rounded-lg overflow-hidden m-6">
            <div className="bg-gray-800 py-4 px-6 border-b">
                <h2 className="font-bold text-white">Delete User</h2>
            </div>
            <div className="p-6">
                {loading && <div className="text-blue-500 text-center mb-6 py-2 bg-blue-50 rounded-md"><span className="font-medium">Loading...</span></div>}
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"><strong className="font-bold">Error: </strong><span>{error}</span></div>}
                {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6"><strong className="font-bold">Success: </strong><span>{message}</span></div>}
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="mb-6">
                        <label htmlFor="user_name" className="block mb-2 text-gray-800 ">User:</label>
                        <input
                            type="text"
                            id="user_name"
                            name="user_name"
                            value={user_name} 
                            readOnly
                            className={`border ${validationErrors.user_name ? 'border-red-500' : 'border-gray-300'} p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {validationErrors.user_name && <p className="text-red-500 text-sm mt-2">{validationErrors.user_name}</p>}
                    </div>
                    <div className="pt-4 border-t">
                        <button type="submit" className="w-full bg-gray-700 text-white p-3 rounded-md hover:bg-gray-800 transition duration-200 font-medium" disabled={loading}>
                            {loading ? 'Deleting User...' : 'Delete User'}
                        </button>
                        <div className="mt-4 text-center">
                            <button type="button" className="text-gray-700 hover:text-gray-800" onClick={() => navigate('/dashboard/show-users')}>Back to Users</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeleteUser;
