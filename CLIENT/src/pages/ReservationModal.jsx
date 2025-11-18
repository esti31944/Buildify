import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  MenuItem,
  TextField,
  Alert,
} from "@mui/material";

export default function ReservationModal({ roomId, onClose }) {
  const [date, setDate] = useState("");
  const [fromHour, setFromHour] = useState("");
  const [toHour, setToHour] = useState("");

  const [openingHours, setOpeningHours] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRoom();
    loadReservations();
  }, []);

  async function loadRoom() {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3001/rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const room = await res.json();

    console.log("📌 Loaded room:", room);

    setOpeningHours(room.openingHours);
  }

  async function loadReservations() {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3001/reservations/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setReservations(data.filter((r) => r.roomId === roomId));
  }

  function generateHours(openingHours) {
    if (!openingHours || !openingHours.from || !openingHours.to) {
      return [];
    }

    const [startH] = openingHours.from.split(":").map(Number);
    const [endH] = openingHours.to.split(":").map(Number);

    const arr = [];
    for (let h = startH; h < endH; h++) {
      arr.push(`${String(h).padStart(2, "0")}:00`);
      arr.push(`${String(h).padStart(2, "0")}:30`);
    }

    return arr;
  }

  // הפונקציה שמחזירה את השעות התפוסות לפי התאריך וההזמנות, מפצלת אותן לפי סוג השעה
  function getBusyHoursByType() {
    if (!date || !openingHours) return { startHours: [], endHours: [], middleHours: [] };

    const allHours = generateHours(openingHours);
    const startHours = [];
    const endHours = [];
    const middleHours = [];

    reservations.forEach((r) => {
      if (r.date !== date) return;

      const fromIndex = allHours.indexOf(r.timeSlot.from);
      const toIndex = allHours.indexOf(r.timeSlot.to);

      if (fromIndex === -1 || toIndex === -1) return;

      startHours.push(r.timeSlot.from);
      endHours.push(r.timeSlot.to);

      for (let i = fromIndex + 1; i < toIndex; i++) {
        middleHours.push(allHours[i]);
      }
    });

    return { startHours, endHours, middleHours };
  }

  function isOverlapping(newFrom, newTo) {
    return reservations.some((res) => {
      if (res.date !== date) return false;
      const a1 = res.timeSlot.from;
      const a2 = res.timeSlot.to;
      return newFrom < a2 && newTo > a1;
    });
  }

  async function handleSubmit() {
    setError("");

    if (!date || !fromHour || !toHour)
      return setError("חובה למלא את כל השדות");

    if (fromHour >= toHour)
      return setError("שעת התחלה חייבת להיות לפני שעת סיום");

    if (isOverlapping(fromHour, toHour))
      return setError("הטווח שהוזן כבר תפוס!");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3001/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId,
          date,
          timeSlot: { from: fromHour, to: toHour },
        }),
      });

      if (!res.ok) throw new Error("שגיאה בהזמנה");

      alert("ההזמנה נשמרה בהצלחה");
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  const hours = openingHours ? generateHours(openingHours) : [];
  const { startHours, endHours, middleHours } = getBusyHoursByType();

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>הזמנת חדר</DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="תאריך"
            type="date"
            value={date}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setDate(e.target.value)}
          />

          <TextField
            select
            label="שעת התחלה"
            value={fromHour}
            onChange={(e) => setFromHour(e.target.value)}
          >
            {hours.map((h) => {
              let disabled = false;
              let sx = {};

              // בשדה שעת התחלה - חסום התחלה ואמצע, לא חסום סיום
              if (startHours.includes(h) || middleHours.includes(h)) {
                disabled = true;
                if (startHours.includes(h)) sx = { borderBottom: "3px solid red" };
                else if (middleHours.includes(h)) sx = { backgroundColor: "#ddd" };
              }

              return (
                <MenuItem key={h} value={h} disabled={disabled} sx={sx}>
                  {h}
                </MenuItem>
              );
            })}
          </TextField>

          <TextField
            select
            label="שעת סיום"
            value={toHour}
            onChange={(e) => setToHour(e.target.value)}
          >
            {hours.map((h) => {
              let disabled = false;
              let sx = {};

              // בשדה שעת סיום - חסום סיום ואמצע, לא חסום התחלה
              if (endHours.includes(h)) {
                disabled = true;
                sx = { borderTop: "3px solid blue" };
              } else if (middleHours.includes(h)) {
                disabled = true;
                sx = { backgroundColor: "#ddd" };
              }

              return (
                <MenuItem key={h} value={h} disabled={disabled} sx={sx}>
                  {h}
                </MenuItem>
              );
            })}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button variant="contained" onClick={handleSubmit}>
          אשר הזמנה
        </Button>
      </DialogActions>
    </Dialog>
  );
}
