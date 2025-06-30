import { selectUsers, selectError, selectLoading } from "../redux/selector/selector";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showUserAction } from "../redux/action/loginAction";
import { useNavigate } from "react-router-dom"; 

const ShowUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const users = useSelector(selectUsers);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    
    useEffect(() => {
        dispatch(showUserAction());
    }, [dispatch]);

    const userRole = localStorage.getItem("user_role") || "default";

    return (
        <div className="max-w-5xl mx-auto m-10">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-gray-800 py-5 px-6 border-b">
                    <h2 className="text-2xl font-bold text-white">User  List</h2>
                </div>
                <div className="p-6">
                    {loading && (
                        <div className="text-blue-500 text-center mb-6 py-3 bg-blue-50 rounded-md">
                            <span className="font-medium">Loading users...</span>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                            <strong className="font-bold">Error: </strong>
                            <span>{error}</span>
                        </div>
                    )}
                    {!loading && users.length === 0 && !error && (
                        <div className="text-center py-12">
                            <div className="text-white text-5xl mb-4">👤</div>
                            <p className="text-white text-lg">No users available.</p>
                        </div>
                    )}
                    {!loading && users.length > 0 && (
                        <ul className="space-y-4">
                            {users.map((user) => (
                                <li key={user.id} className="bg-gray-500 p-4 rounded-lg shadow-sm flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg text-white font-semibold">{user.name}</h3>
                                        <p className="text-white">{user.email}</p>
                                        <p className="text-white">{user.role}</p>
                                    </div>
                                    <div className="ml-auto flex space-x-2">
                                        {userRole === 'super_admin' && (
                                            <>
                                                <button 
                                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                                    onClick={() => navigate(`/dashboard/show-users/update-user/${user.user_name}`)} 
                                                >
                                                    Update
                                                </button>
                                                <button 
                                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                                    onClick={() => navigate(`/dashboard/show-users/delete-user/${user.user_name}`)} 
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShowUsers;
