import React, { useState, useEffect } from "react";
import Card from "../components/Card";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcement",
    expiresAt: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3001/notices/list", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error(`שגיאה בטעינת המודעות: קוד ${res.status}`);
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
        alert("עדכון לא ממומש כאן");
        return;
      }

      const token = localStorage.getItem("token");

      const sendData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
      };
      if (formData.expiresAt) sendData.expiresAt = formData.expiresAt;

      const res = await fetch("http://localhost:3001/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(sendData),
      });

      if (!res.ok) throw new Error("שגיאה בהוספת המודעה");
      const newNotice = await res.json();
      setNotices(prev => [...prev, newNotice]);
      setFormData({ title: "", content: "", category: "announcement", expiresAt: "" });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
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
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
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
              סוג: {n.category === "event" ? "אירוע" : "הודעה"}
            </small>
            {n.expiresAt && (
              <small style={{ color: "#999", display: "block" }}>
                פג תוקף ב: {new Date(n.expiresAt).toLocaleDateString()}
              </small>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
