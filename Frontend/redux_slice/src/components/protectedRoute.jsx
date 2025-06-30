import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../redux/selector/selector";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const getToken = localStorage.getItem("token")
  const location = useLocation();

  useEffect(() => {
    console.log("Protected Route Check - Authentication Status:", isAuthenticated);
    // console.log("Token in localStorage:", localStorage.getItem('token'));
  }, [isAuthenticated]);

  if (!getToken || (isAuthenticated && isAuthenticated === false)) {
    console.log("Access denied - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("Access granted to protected route");
  return children;
};

export default ProtectedRoute;
