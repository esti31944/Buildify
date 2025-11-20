import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";

import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice as deleteNoticeAction
} from "../features/notice/NoticeSlice";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function Notices() {
  const dispatch = useDispatch();

  const { list: notices, loading, error } = useSelector(
    (state) => state.notices
  );

  const [currentUser, setCurrentUser] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcement",
    expiresAt: ""
  });

  const [editingId, setEditingId] = useState(null);

  // --- פענוח טוקן ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setCurrentUser(parseJwt(token));
  }, []);

  // --- טעינת המודעות מה-Slice ---
  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("אנא מלא את כל השדות");
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
    };

    if (formData.expiresAt) payload.expiresAt = formData.expiresAt;

    if (editingId) {
      await dispatch(updateNotice({ id: editingId, data: payload }));
    } else {
      await dispatch(createNotice(payload));
    }

    setFormData({
      title: "",
      content: "",
      category: "announcement",
      expiresAt: ""
    });

    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(n) {
    setEditingId(n._id);
    setFormData({
      title: n.title,
      content: n.content,
      category: n.category,
      expiresAt: n.expiresAt ? n.expiresAt.split("T")[0] : "",
    });
    setShowForm(true);
  }

  async function deleteNotice(id) {
    if (!window.confirm("האם למחוק את ההודעה?")) return;
    await dispatch(deleteNoticeAction(id));
  }

  if (loading) return <div>טוען מודעות...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div>
      <h1>לוח מודעות</h1>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ➕ הוסף מודעה
          </button>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: 10,
              marginBottom: 10,
              border: "1px solid #ccc",
              padding: 12,
              borderRadius: 6,
            }}
          >
            <div>
              <label>
                כותרת:<br />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: 6, marginBottom: 8 }}
                />
              </label>
            </div>

            <div>
              <label>
                תוכן:<br />
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{ width: "100%", padding: 6, marginBottom: 8 }}
                />
              </label>
            </div>

            <div>
              <label>
                סוג הודעה:<br />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ padding: 6, marginBottom: 8 }}
                >
                  <option value="event">אירוע</option>
                  <option value="announcement">הודעה</option>
                </select>
              </label>
            </div>

            <div>
              <label>
                תאריך תפוגה (אופציונלי):<br />
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  style={{ padding: 6, marginBottom: 8 }}
                />
              </label>
            </div>

            <button type="submit" className="btn btn-success" style={{ marginRight: 8 }}>
              שמור
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              ביטול
            </button>
          </form>
        )}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {notices.map((n) => {
          const canManage =
            currentUser &&
            (currentUser.role === "admin" || currentUser._id === n.createdBy);

          return (
            <Card key={n._id} title={n.title}>
              <div>{n.content}</div>

              <small style={{ color: "#666", marginTop: 6, display: "block" }}>
                סוג: {n.category === "event" ? "אירוע" : "הודעה"}
              </small>

              {n.expiresAt && (
                <small style={{ color: "#999", display: "block" }}>
                  פג תוקף ב: {new Date(n.expiresAt).toLocaleDateString()}
                </small>
              )}

              {canManage && (
                <div style={{ marginTop: 10 }}>
                  <button
                    className="btn btn-warning"
                    onClick={() => startEdit(n)}
                    style={{ marginRight: 8 }}
                  >
                    ✏️ עדכן
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteNotice(n._id)}
                  >
                    🗑️ מחק
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
