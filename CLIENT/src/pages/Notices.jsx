import React from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";

export default function Notices() {
  const { user } = useAuth();

  const notices = [
    { title: "כיבוי מים מתוכנן", content: "כיבוי מים ביום שישי בין 09:00-12:00" },
    { title: "מסיבת קהילה", content: "ערב קהילתי בחדר האירועים ב-2025-11-20" }
  ];

  return (
    <div>
      <h1>לוח מודעות</h1>

      {user.role === "admin" && <div style={{ marginTop:10, marginBottom:10 }}><button className="btn btn-primary">פרסם הודעה</button></div>}

      <div style={{ display:"grid", gap:12 }}>
        {notices.map((n, i) => (
          <Card key={i} title={n.title}>
            <div>{n.content}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
