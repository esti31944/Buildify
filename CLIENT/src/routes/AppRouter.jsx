import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Issues from "../pages/Issues";
import Payments from "../pages/Payments";
import PaymentsManager from "../pages/PaymentsManager";
import Documents from "../pages/Documents";
import Notices from "../pages/Notices";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export default function AppRoutes() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/PaymentsManager" element={<PaymentsManager />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/notices" element={<Notices />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
