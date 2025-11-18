// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const ctx = useContext(AuthContext);
  if (!ctx) return null; // context not ready

  const { user } = ctx;
  console.log("PrivateRoute user:", user);

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
