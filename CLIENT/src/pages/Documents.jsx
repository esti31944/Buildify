import React, { useState, useEffect } from "react";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // טוקן לדוגמה - תעדכני לפי הצורך
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTBjNzkzNDZjZmFiYzU4OGNkNzEzYTgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjMwMzA4MzQsImV4cCI6MTc2MzExNzIzNH0.69cCgxpYNYCgXQoViaUdPjzcOkOEWVmf21aD-10aU88";

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch("http://localhost:3001/rooms", {
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
  }, [token]);

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

    try {
      const res = await fetch("http://localhost:3001/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("שגיאה בהוספת החדר");
      const newRoom = await res.json();
      setRooms((prev) => [...prev, newRoom]);
      setFormData({ name: "", description: "" });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div>טוען חדרים...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <div>
      <h1>רשימת חדרים</h1>

      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{ marginBottom: 12 }}>
          ➕ הוסף חדר
        </button>
      )}

      {showForm && (
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
            שמור
          </button>
          <button type="button" onClick={() => setShowForm(false)}>
            ביטול
          </button>
        </form>
      )}

      <ul>
        {rooms.map((room) => (
          <li key={room.id || room._id}>
            <strong>{room.name}</strong>
            {room.description && <p>{room.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
