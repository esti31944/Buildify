import React, { useState, useEffect } from "react";
import Card from "../components/Card";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", type: "announcement" });
  const [editingIndex, setEditingIndex] = useState(null);

  // פונקציה שאחראית על קבלת המודעות מהשרת
  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices");  // כאן מתקשרת ל-API שלך
        if (!res.ok) throw new Error("שגיאה בטעינת המודעות");
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("אנא מלא את כל השדות");
      return;
    }

    try {
      if (editingIndex !== null) {
        // עדכון מודעה קיימת בשרת
        const noticeToUpdate = notices[editingIndex];
        const res = await fetch(`/api/notices/${noticeToUpdate.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("שגיאה בעדכון המודעה");
        const updatedNotice = await res.json();
        setNotices(prev => prev.map((n, i) => (i === editingIndex ? updatedNotice : n)));
      } else {
        // הוספת מודעה חדשה לשרת
        const res = await fetch("/api/notices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("שגיאה בהוספת המודעה");
        const newNotice = await res.json();
        setNotices(prev => [...prev, newNotice]);
      }
      setFormData({ title: "", content: "", type: "announcement" });
      setEditingIndex(null);
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(index) {
    const noticeToDelete = notices[index];
    try {
      const res = await fetch(`/api/notices/${noticeToDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("שגיאה במחיקת המודעה");
      setNotices(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      alert(err.message);
    }
  }

  function startEditing(index) {
    setEditingIndex(index);
    setFormData(notices[index]);
    setShowForm(true);
  }

  function cancelEditing() {
    setEditingIndex(null);
    setFormData({ title: "", content: "", type: "announcement" });
    setShowForm(false);
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
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ padding: 6, marginBottom: 8 }}
                >
                  <option value="event">אירוע</option>
                  <option value="announcement">הודעה</option>
                </select>
              </label>
            </div>

            <button type="submit" className="btn btn-success" style={{ marginRight: 8 }}>
              {editingIndex !== null ? "עדכן" : "שמור"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelEditing}>
              ביטול
            </button>
          </form>
        )}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {notices.map((n, i) => (
          <Card key={n.id || i} title={n.title}>
            <div>{n.content}</div>
            <small style={{ color: "#666", marginTop: 6, display: "block" }}>
              סוג: {n.type === "event" ? "אירוע" : "הודעה"}
            </small>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={() => startEditing(i)}>
                עדכן
              </button>
              <button className="btn btn-secondary" onClick={() => handleDelete(i)}>
                מחק
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
