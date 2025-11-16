import React from "react";
import "../styles/IssueCard.css"

export default function IssueCard({ title, description, imageUrl, createdAt, userId, status }) {
  const statusMap = {
    new: { label: "פתוחה", class: "badge open" },
    // פתוחה: { label: "פתוחה", class: "badge open" },
    in_progress: { label: "בטיפול", class: "badge progress" },
    // בטיפול: { label: "בטיפול", class: "badge progress" },
    fixed: { label: "תוקנה", class: "badge fixed" },
    // תוקנה: { label: "תוקנה", class: "badge fixed" },
  };

  const { label, class: statusClass } =
    statusMap[status] || { label: status, class: "badge" };

  return (
    <div className="issue-card">
      {imageUrl &&
      <div className="issue-image">
        <img src={imageUrl} alt={title}></img>
      </div>}
      <div className="issue-content">
        <div className="issue-header">
          <div className="issue-title">{title}</div>
            <span className={statusClass}>{label}</span>
        </div>
        <p className="issue-description">
          {description?.length > 80 ? description.slice(0, 80) + "..." : description}
        </p>
        <div className="issue-footer">
          <span className="issue-date">
            {new Date(createdAt).toLocaleDateString("he-IL")}
          </span>
        </div>
      </div>
    </div>
  );
}