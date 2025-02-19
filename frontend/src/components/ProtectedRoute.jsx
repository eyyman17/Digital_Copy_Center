import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthenticatedUser } from "../utils/auth";

const ProtectedRoute = ({ element: Element, allowedRole }) => {
  const user = getAuthenticatedUser();
  const isAuthenticated = user?.isAuthenticated;
  const hasRequiredRole = user?.role === allowedRole;

  if (!isAuthenticated) {
    return <Navigate to="/accounts/login/" replace />;
  }

  if (allowedRole && !hasRequiredRole) {
    return <Navigate to="/accounts/login/" replace />;
  }

  return Element;
};

export default ProtectedRoute;