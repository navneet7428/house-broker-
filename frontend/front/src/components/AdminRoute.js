import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../services/auth";

const AdminRoute = ({ children }) => {
  const user = getUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;