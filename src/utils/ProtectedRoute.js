import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Si no existe token
  if (!token || token === "NOK") {
    localStorage.setItem("isLogin", false);
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    // Token expirado
    if (decoded.exp < now) {
      localStorage.setItem("isLogin", false);
      localStorage.setItem("token", "NOK");
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    // Token inválido
    localStorage.setItem("isLogin", false);
    localStorage.setItem("token", "NOK");
    return <Navigate to="/login" replace />;
  }

  // Si está ok
  return children;
};

export default ProtectedRoute;
