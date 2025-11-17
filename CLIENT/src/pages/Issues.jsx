//pages>Issues.jsx
import React, { useState, useEffect } from "react";
import IssueCard from "../components/IssueCard";
import FaultReportForm from "../components/FaultReportForm"
import { useSelector, useDispatch } from "react-redux";
import { fetchMyIssues, fetchAllIssues } from "../features/issues/issuesSlice";
import "../styles/Issues.css"

export default function Issues() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.issues);
    const user = useSelector((state) => state.auth.user);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!user) return;

        if (user.role === "admin") {
            dispatch(fetchAllIssues());
        } else {
            dispatch(fetchMyIssues());
        }
    }, [dispatch, user]);

    if (loading) return <p>טוען...</p>;
    if (error) return <p>שגיאה: {error}</p>;

    return (
        <div>
            <h1 style={{ marginBottom: 12 }}>ניהול תקלות</h1>

            {user?.role !== "admin" && (
                <div style={{ marginBottom: 12 }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}>
                        הוסף תקלה חדשה
                    </button>
                </div>
            )}

            <div className="issues-grid">
                {list.length > 0 ? (
                    list.map((it, i) => <IssueCard key={i} {...it} />)
                ) : (
                    <p>לא נמצאו תקלות</p>
                )}
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            className="modal-close"
                            onClick={() => setShowForm(false)}
                        >
                            ✕
                        </button>
                        <FaultReportForm />
                    </div>
                </div>
            )}
        </div>
    );
}