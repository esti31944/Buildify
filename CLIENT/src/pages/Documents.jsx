import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  Paper,
} from "@mui/material";

import ReservationModal from "./ReservationModal";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import MyReservationsModal from "./MyReservationsModal"; // הוספתי את המודאל להצגת הזמנות אישיות

export default function Rooms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [isMyResModalOpen, setIsMyResModalOpen] = useState(false); // מצב פתיחת מודאל ההזמנות האישיות

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.role === "admin");
      } catch {}
    }

    async function fetchRooms() {
      try {
        const res = await fetch("http://localhost:3001/rooms/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("בעיה בטעינת חדרים");
        const data = await res.json();
        setRooms(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const url = editingRoomId
      ? `http://localhost:3001/rooms/${editingRoomId}`
      : `http://localhost:3001/rooms`;

    const method = editingRoomId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("שגיאה בשמירה");

      const saved = await res.json();

      if (editingRoomId) {
        setRooms((prev) =>
          prev.map((r) => (r._id === editingRoomId ? saved : r))
        );
      } else {
        setRooms((prev) => [...prev, saved]);
      }

      setFormData({ name: "", description: "" });
      setEditingRoomId(null);
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("למחוק את החדר?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3001/rooms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("שגיאה במחיקה");

      setRooms((prev) => prev.filter((room) => room._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  function startEdit(room) {
    setFormData({ name: room.name, description: room.description || "" });
    setEditingRoomId(room._id);
    setShowForm(true);
  }

  if (loading) return <div>טוען...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        חדרים זמינים
      </Typography>

      {/* כפתור לצפייה בהזמנות שלי */}
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => setIsMyResModalOpen(true)}
      >
        צפה בהזמנות שלי
      </Button>

      {/* כפתור הוספה */}
      {isAdmin && !showForm && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
          sx={{ mb: 3, borderRadius: 3 }}
        >
          הוסף חדר
        </Button>
      )}

      {/* טופס */}
      {showForm && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 4 }} elevation={3}>
          <Typography variant="h6" mb={2}>
            {editingRoomId ? "עריכת חדר" : "הוספת חדר חדש"}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="שם חדר"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              label="תיאור"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <Button variant="contained" type="submit" sx={{ mr: 2 }}>
              שמור
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowForm(false);
                setEditingRoomId(null);
              }}
            >
              ביטול
            </Button>
          </form>
        </Paper>
      )}

      {/* רשימת חדרים */}
      <Box sx={{ display: "grid", gap: 2 }}>
        {rooms.map((room) => (
          <Card
            key={room._id}
            sx={{
              bgcolor: "#F5F9FF",
              borderRadius: 4,
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <HomeWorkIcon sx={{ fontSize: 40, color: "#247CFF", ml: 2 }} />

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{room.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {room.description || "ללא תיאור"}
                </Typography>
              </Box>

              {isAdmin && (
                <>
                  <IconButton onClick={() => startEdit(room)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(room._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </CardContent>

            <Divider />

            <CardActions sx={{ p: 2, justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                sx={{ borderRadius: 3 }}
                onClick={() => {
                  setSelectedRoomId(room._id);
                  setIsModalOpen(true);
                }}
              >
                הזמן עכשיו
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* ⭐ כאן מודל ההזמנה! ⭐ */}
      {isModalOpen && (
        <ReservationModal
          roomId={selectedRoomId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* מודאל הזמנות אישיות */}
      {isMyResModalOpen && (
        <MyReservationsModal onClose={() => setIsMyResModalOpen(false)} />
      )}
    </Box>
  );
}
