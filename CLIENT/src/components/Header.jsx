import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  return (
    <div className="header">
      <div>
        <h2 style={{ margin:0, fontSize:18 }}>
          {user?.role === "admin" ? "לוח ניהול - מנהל ועד" : "לוח דייר"}
        </h2>
        <div style={{color:"var(--muted)", fontSize:13}}>{new Date().toLocaleDateString("he-IL")}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize:14, color: "var(--muted)" }}>{user?.fullName}</div>
      </div>
    </div>
  );
}
