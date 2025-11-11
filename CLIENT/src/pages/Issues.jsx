import React from "react";
import IssueCard from "../components/IssueCard";
import { useAuth } from "../context/AuthContext";

export default function Issues() {
  const { user } = useAuth();

  const mockIssues = [
    { title: "נזילה בחדר מדרגות", date: "2025-11-01", reporter: "רות כהן", status: "פתוחה" },
    { title: "תאורה בחניה", date: "2025-11-05", reporter: "דני לוי", status: "בטיפול" },
    { title: "שער כניסה תקוע", date: "2025-11-09", reporter: "מיכל ברק", status: "הושלמה" }
  ];

  return (
    <div>
      <h1 style={{ marginBottom:12 }}>ניהול תקלות</h1>

      {user?.role === "admin" && (
        <div style={{ marginBottom:12 }}>
          <button className="btn btn-primary">הוסף תקלה חדשה</button>
        </div>
      )}

      <div style={{ display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))" }}>
        {mockIssues.map((it, i) => <IssueCard key={i} {...it} />)}
      </div>
    </div>
  );
}
