import React from "react";

export default function IssueCard({ title, date, reporter, status }) {
  const statusMap = {
    new: { label: "פתוחה", class: "badge open" },
    פתוחה: { label: "פתוחה", class: "badge open" },
    in_progress: { label: "בטיפול", class: "badge progress" },
    בטיפול: { label: "בטיפול", class: "badge progress" },
    fixed: { label: "תוקנה", class: "badge fixed" },
    תוקנה: { label: "תוקנה", class: "badge fixed" },
  };

  const { label, class: statusClass } =
    statusMap[status] || { label: status, class: "badge" };

  return (
    <div className="issue-card">
      <div className="issue-title">{title}</div>
      <div className="issue-meta">
        {reporter} • {new Date(date).toLocaleDateString("he-IL")}
      </div>
      <div style={{ marginTop: 8 }}>
        <span className={statusClass}>{label}</span>
      </div>
    </div>
  );
}