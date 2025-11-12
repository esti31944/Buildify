import React from "react";
import { useSelector } from "react-redux";
import TenantDashboard from "./TenantDashboard";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
    const user = useSelector((state) => state.auth.user);
    return user?.role === "admin" ? <AdminDashboard /> : <TenantDashboard />;
}
