import React, { useState, useEffect } from "react";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const [isAdmin, setIsAdmin] = useState(false);

  // מצב עדכון: מכיל את ה-ID של החדר שמתעדכנים או null אם לא בעדכון
  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.role === "admin");
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    }

    async function fetchRooms() {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:3001/rooms/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`שגיאה בטעינת החדרים: ${res.status}`);
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("אנא הזיני שם חדר");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      let res;
      if (editingRoomId) {
        // עדכון חדר קיים
        res = await fetch(`http://localhost:3001/rooms/${editingRoomId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // הוספת חדר חדש
        res = await fetch("http://localhost:3001/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error("שגיאה בשמירת החדר");
      const savedRoom = await res.json();

      if (editingRoomId) {
        // עדכון ברשימה
        setRooms((prev) =>
          prev.map((room) => (room._id === editingRoomId ? savedRoom : room))
        );
      } else {
        // הוספה לרשימה
        setRooms((prev) => [...prev, savedRoom]);
      }

      setFormData({ name: "", description: "" });
      setShowForm(false);
      setEditingRoomId(null);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    if (!window.confirm("את בטוחה שברצונך למחוק את החדר?")) return;

    try {
      const res = await fetch(`http://localhost:3001/rooms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("שגיאה במחיקת החדר");

      setRooms((prev) => prev.filter((room) => room._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  function startEdit(room) {
    setFormData({ name: room.name, description: room.description || "" });
    setShowForm(true);
    setEditingRoomId(room._id);
  }

  if (loading) return <div>טוען חדרים...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div>
      <h1>רשימת חדרים</h1>

      {isAdmin && !showForm && (
        <button onClick={() => setShowForm(true)} style={{ marginBottom: 12 }}>
          ➕ הוסף חדר
        </button>
      )}

      {showForm && isAdmin && (
        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 6,
            marginBottom: 20,
          }}
        >
          <div>
            <label>
              שם חדר:<br />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: 6, marginBottom: 8 }}
              />
            </label>
          </div>

          <div>
            <label>
              תיאור (אופציונלי):<br />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                style={{ width: "100%", padding: 6, marginBottom: 8 }}
              />
            </label>
          </div>

          <button type="submit" style={{ marginRight: 8 }}>
            {editingRoomId ? "עדכן" : "שמור"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingRoomId(null);
              setFormData({ name: "", description: "" });
            }}
          >
            ביטול
          </button>
        </form>
      )}

      <ul>
        {rooms.map((room) => (
          <li key={room._id || room.id} style={{ marginBottom: 10 }}>
            <strong>{room.name}</strong>
            {room.description && <p>{room.description}</p>}

            {isAdmin && (
              <>
                <button
                  onClick={() => startEdit(room)}
                  style={{ marginRight: 8 }}
                >
                  עדכן
                </button>
                <button onClick={() => handleDelete(room._id)}>מחק</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
