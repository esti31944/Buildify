// components>Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Sidebar() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const links =
        user?.role === "admin"
            ? [
                { to: "/", label: "דשבורד" },
                { to: "/issues", label: "תקלות" },
                { to: "/payments", label: "תשלומים" },
                { to: "/documents", label: "חדרים/מסמכים" },
                { to: "/notices", label: "לוח מודעות" }
            ]
            : [
                { to: "/", label: "הבית שלי" },
                { to: "/issues", label: "התקלות שלי" },
                { to: "/payments", label: "התשלומים שלי" },
                { to: "/documents", label: "חדרים/מסמכים" },
                { to: "/notices", label: "לוח מודעות" }
            ];

    return (
        <aside className="sidebar">
            <div className="logo">ועד דיגיטלי</div>
            <nav className="nav">
                {links.map(l => (
                    <NavLink key={l.to} to={l.to} className="nav-link">
                        {l.label}
                    </NavLink>
                ))}
            </nav>

            <div style={{ marginTop: 12 }}>
                <div style={{ color: "#374151", fontSize: 14, marginBottom: 8 }}>
                    {user?.fullName} <br />
                    <span style={{ color: "#9ca3af", fontSize: 12 }}>{user?.role === "admin" ? "מנהל" : "דייר"}</span>
                </div>
                <button className="btn btn-ghost" onClick={() => dispatch(logout())}>
                    התנתק
                </button>
            </div>
        </aside>
    );
}
