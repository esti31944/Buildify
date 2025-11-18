import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="content-area">
        <Header />
        <main style={{ marginTop: 12 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
