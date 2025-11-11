import React from "react";
import { useAuth } from "../../context/AuthContext";
import TenantDashboard from "./TenantDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminDashboard /> : <TenantDashboard />;
}
