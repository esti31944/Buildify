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
} from "@mui/material";

import ReservationModal from "./ReservationModal";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import MyReservationsModal from "./MyReservationsModal";

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
      } catch {}
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

  if (loading) return <div>טוען...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2, direction: "rtl" }}>
      {/* כותרת ראשית */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          justifyContent: "flex-start",
          gap: 1,
        }}
      >
        <HomeWorkIcon sx={{ fontSize: 32, color: "#2c7be5" }} />
        <Typography variant="h5" fontWeight="bold">
          חדרים משותפים
        </Typography>
      </Box>
      <Typography color="text.secondary" mb={3}>
        הזמן חדרים משותפים בבניין
      </Typography>

      {/* אזור הזמנות שלי */}
      <Paper
        elevation={1}
        sx={{
          backgroundColor: "#e7f0ff",
          borderRadius: 3,
          p: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ color: "#1565c0" }} />
            <Typography fontWeight="bold">ההזמנות שלי</Typography>
          </Box>

          <Button
            variant="text"
            size="small"
            onClick={() => setIsMyResModalOpen(true)}
            sx={{ fontWeight: "bold", color: "#1565c0" }}
          >
            צפה בכולן
          </Button>
        </Box>

        {/* כאן אתה תוכל למפות את ההזמנות שלי */}
        {/* דוגמה - מומלץ להחליף לפי הנתונים האמיתיים */}
        {/* לדוגמה, תוכל למפות את ההזמנות בתוך המודל MyReservationsModal */}
      </Paper>

      {/* כפתור הוספת חדר למנהלים */}
      {isAdmin && !showForm && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm(true)}
          sx={{ mb: 3, borderRadius: 3, backgroundColor: "#1565c0" }}
        >
          הוסף חדר
        </Button>
      )}

      {/* טופס הוספה/עריכה */}
      {showForm && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }} elevation={3}>
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

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                type="submit"
                sx={{ borderRadius: 3, backgroundColor: "#1565c0" }}
              >
                שמור
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowForm(false);
                  setEditingRoomId(null);
                }}
                sx={{ borderRadius: 3 }}
              >
                ביטול
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* רשימת חדרים זמינים */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "flex-start",
            gap: 1,
          }}
        >
          <MeetingRoomIcon sx={{ color: "#333", fontSize: 26 }} />
          <Typography variant="h6" fontWeight="bold">
            חדרים זמינים
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {rooms.map((room) => (
            <Card
              key={room._id}
              sx={{
                borderRadius: 3,
                boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
                padding: 1,
                direction: "rtl",
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center" }}>
                <HomeWorkIcon sx={{ fontSize: 28, color: "#247CFF", ml: 2 }} />

                <Box sx={{ flexGrow: 1, textAlign: "right" }}>
                  <Typography variant="subtitle1">{room.name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: 13 }}
                  >
                    {room.description || "ללא תיאור"}
                  </Typography>
                </Box>

                {isAdmin && (
                  <Box>
                    <IconButton onClick={() => startEdit(room)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(room._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </CardContent>

              <Divider />

              <CardActions
                sx={{
                  p: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 1,
                    minWidth: 130,
                    paddingY: 1,
                    backgroundColor: "#247CFF",
                    "&:hover": { backgroundColor: "#1a5fcc" },
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
