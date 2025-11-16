import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateIssueStatus } from "../features/issues/issuesSlice";
import "../styles/IssueCard.css"

export default function IssueCard({ _id,title, description, imageUrl, createdAt, userId, status }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const statusMap = {
    new: { label: "נשלחה", class: "badge open" },
    // פתוחה: { label: "נשלחה", class: "badge open" },
    in_progress: { label: "בטיפול", class: "badge progress" },
    // בטיפול: { label: "בטיפול", class: "badge progress" },
    fixed: { label: "תוקנה", class: "badge fixed" },
    // תוקנה: { label: "תוקנה", class: "badge fixed" },
  };

  const { label, class: statusClass } =
    statusMap[status] || { label: status, class: "badge" };

  const handleStatusChange = () => {
    dispatch(updateIssueStatus(_id));
  };

  return (
    <div className="issue-card">
      <div className="issue-content">
        <div className="issue-header">
          <div className="issue-title">{title}</div>
          {user?.role === "admin" && status !== "fixed" && (
            <button className="btn btn-status" onClick={handleStatusChange}>
              החלף סטטוס
            </button>
          )}
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

        <div className="issue-image-wrapper">
          {imageUrl ? (
            <div className="issue-image">
              <img src={imageUrl} alt={title}></img>
            </div>) : (
            <div className="issue-image-placeholder">
              אין תמונה
            </div>
          )}
        </div>
      </div>
    </div>
  );
}