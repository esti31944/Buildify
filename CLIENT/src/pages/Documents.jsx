import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ReservationModal from "./ReservationModal";
import MyReservationsModal from "./MyReservationsModal";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import {
  fetchRooms,
  addRoom,
  updateRoom,
  deleteRoom,
} from "../features/room/RoomSlice";

export default function Rooms() {
  const dispatch = useDispatch();
  const { rooms, loading, error } = useSelector((state) => state.rooms);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [isMyResModalOpen, setIsMyResModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.role === "admin");
      } catch { }
    }
    dispatch(fetchRooms());
  }, [dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingRoomId) {
        await dispatch(updateRoom({ id: editingRoomId, formData })).unwrap();
      } else {
        await dispatch(addRoom(formData)).unwrap();
      }
      setFormData({ name: "", description: "" });
      setEditingRoomId(null);
      setShowForm(false);
    } catch (err) {
      alert(err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("למחוק את החדר?")) return;
    try {
      await dispatch(deleteRoom(id)).unwrap();
    } catch (err) {
      alert(err);
    }
  }

  function startEdit(room) {
    setFormData({ name: room.name, description: room.description || "" });
    setEditingRoomId(room._id);
    setShowForm(true);
  }

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <Box sx={{ p: 2, direction: "rtl" }}>

      {/* כותרת */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          חדרים משותפים
        </Typography>
        <Typography color="text.secondary">
          הזמן חדרים משותפים בבניין
        </Typography>
      </Box>

      {/* ההזמנות שלי */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: "#ffffffff",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ color: "#ffffffff" }} />
            <Typography fontWeight="bold">ההזמנות שלי</Typography>
          </Box>

          <Button
            variant="text"
            onClick={() => setIsMyResModalOpen(true)}
            sx={{ fontWeight: "bold", color: "#090909ff" }}
          >
            צפה בכולן
          </Button>
        </Box>
      </Paper>

      {/* הוספת חדר – למנהלים */}
      {isAdmin && !showForm && (
        <Button
          variant="contained"
          onClick={() => setShowForm(true)}
          sx={{
            minWidth: 0,
            width: 40,
            height: 40,
            padding: 0,
            borderRadius: "50%",
            backgroundColor: "#94b6d9ff",
            "&:hover": {
              backgroundColor: "#7fa5ccff",
            },
            mb: 3,
          }}
        >
          <AddIcon />
        </Button>

      )}

      {/* טופס עריכה/הוספה */}
      {showForm && (
        <Dialog
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingRoomId(null);
            setFormData({ name: "", description: "" });
          }}
          maxWidth="sm"
          fullWidth
          dir="rtl"
        >
          <DialogTitle sx={{ textAlign: "right" }}>
            {editingRoomId ? "עריכת חדר" : "הוספת חדר חדש"}
          </DialogTitle>

          <DialogContent dividers>
            <form id="room-form" onSubmit={handleSubmit}>
              <TextField
                label="שם חדר"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
                inputProps={{ style: { textAlign: "right" } }}
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
                inputProps={{ style: { textAlign: "right" } }}
              />
            </form>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setShowForm(false);
                setEditingRoomId(null);
                setFormData({ name: "", description: "" });
              }}
            >
              ביטול
            </Button>
            <Button type="submit" form="room-form" variant="contained">
              שמור
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* רשימת חדרים */}
      {/* רשימת חדרים */}
      <Typography
        variant="h6"
        sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}
      >
        <MeetingRoomIcon />
        חדרים זמינים
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {rooms.map((room) => (
          <Card
            key={room._id}
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              p: 1.5,
              transition: "0.25s",
              backgroundColor: "#ffffff",
              "&:hover": {
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                transform: "translateY(-4px)",
                backgroundColor: "#f7f7f7",
              },
              direction: "rtl",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                pb: 1.5,
              }}
            >
              <HomeWorkIcon sx={{ fontSize: 34, color: "#6fd674ff" }} />

              <Box sx={{ flexGrow: 1, textAlign: "right" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, fontSize: "1rem", color: "#111" }}
                >
                  {room.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontSize: ".85rem", color: "#555" }}
                >
                  {room.description || "ללא תיאור"}
                </Typography>
              </Box>

              {isAdmin && (
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <IconButton size="small">
                    <EditIcon fontSize="small" sx={{ color: "#444" }} />
                  </IconButton>

                  <IconButton color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </CardContent>

            <Divider sx={{ borderColor: "#e0e0e0" }} />

            <CardActions sx={{ justifyContent: "flex-end", pt: 1.5 }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1,
                  fontWeight: 600,
                  borderColor: "#999",   // מסגרת אפורה
                  color: "#555",         // טקסט אפור כהה
                  "&:hover": {
                    borderColor: "#666", // מסגרת אפורה כהה ב-hover
                    backgroundColor: "#f5f5f5", // אפור ממש בהיר ל-hover
                  },
                }}
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
      {/* מודל הזמנה */}
      {isModalOpen && (
        <ReservationModal
          roomId={selectedRoomId}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* מודל ההזמנות שלי */}
      {isMyResModalOpen && (
        <MyReservationsModal onClose={() => setIsMyResModalOpen(false)} />
      )}
    </Box>
  );
}
