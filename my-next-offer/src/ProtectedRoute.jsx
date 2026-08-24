import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ currentUser }) {
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}
