import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

export default function ReservationModal({ roomId, onClose }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  async function handleSubmit() {
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
          time,
        }),
      });

      if (!res.ok) throw new Error("שגיאה בהזמנה");

      alert("הזמנה נשמרה בהצלחה!");
      onClose();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>הזמנת חדר</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="תאריך"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <TextField
            label="שעה"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button variant="contained" onClick={handleSubmit}>
          שמור הזמנה
        </Button>
      </DialogActions>
    </Dialog>
  );
}
