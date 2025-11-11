import React from "react";

export default function IssueCard({ title, date, reporter, status }) {
  const statusClass = status === "פתוחה" ? "badge open" : status === "בטיפול" ? "badge progress" : "badge fixed";
  return (
    <div className="issue-card">
      <div className="issue-title">{title}</div>
      <div className="issue-meta">{reporter} • {date}</div>
      <div style={{ marginTop: 8 }}>
        <span className={statusClass}>{status}</span>
      </div>
    </div>
  );
}
