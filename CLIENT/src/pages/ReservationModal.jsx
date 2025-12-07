import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchNotifications } from '../features/notifications/notificationsSlice';

export default function ReservationModal({ roomId, onClose }) {
  const dispatch = useDispatch()
  const [date, setDate] = useState("");
  const [fromHour, setFromHour] = useState("");
  const [toHour, setToHour] = useState("");

  const [openingHours, setOpeningHours] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  useEffect(() => {
    loadReservations();
  }, [roomId, date]);

  async function loadRoom() {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3001/rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const room = await res.json();
      // console.log("Loaded room:", room);
      setOpeningHours(room.openingHours);
    }
  }

  async function loadReservations() {
    if (!date) {
      setReservations([]);
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3001/reservations/list?roomId=${roomId}&date=${date}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      // console.log(" Loaded reservations for room and date:", data);
      setReservations(data);
    }
  }

  function generateHours(openingHours) {
    if (!openingHours || !openingHours.from || !openingHours.to) {
      return [];
    }

    const [startH, startM] = openingHours.from.split(":").map(Number);
    const [endH, endM] = openingHours.to.split(":").map(Number);

    const arr = [];
    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    while (currentMinutes < endMinutes) {
      const hh = Math.floor(currentMinutes / 60);
      const mm = currentMinutes % 60;
      arr.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
      currentMinutes += 30;
    }

    return arr;
  }

  function timeToMinutes(timeStr) {
    const [hh, mm] = timeStr.split(":").map(Number);
    return hh * 60 + mm;
  }

  function getBusyHoursByType() {
    if (!openingHours) return { startHours: [], endHours: [], middleHours: [] };

    const allHours = generateHours(openingHours);
    const startHours = [];
    const endHours = [];
    const middleHours = [];

    reservations.forEach((r) => {
      const fromIndex = allHours.indexOf(r.timeSlot.from);
      const toIndex = allHours.indexOf(r.timeSlot.to);

      if (fromIndex === -1 || toIndex === -1) return;

      startHours.push(r.timeSlot.from);
      endHours.push(r.timeSlot.to);

      for (let i = fromIndex + 1; i < toIndex; i++) {
        middleHours.push(allHours[i]);
      }
    });

    // console.log("Busy Hours:", { startHours, endHours, middleHours });
    return { startHours, endHours, middleHours };
  }

  function isOverlapping(newFrom, newTo) {
    const newFromM = timeToMinutes(newFrom);
    const newToM = timeToMinutes(newTo);

    return reservations.some((res) => {
      const resFromM = timeToMinutes(res.timeSlot.from);
      const resToM = timeToMinutes(res.timeSlot.to);

      return newFromM < resToM && newToM > resFromM;
    });
  }

  async function handleSubmit() {
    setError("");

    if (!date || !fromHour || !toHour) {
      setError("חובה למלא את כל השדות");
      return;
    }

    if (fromHour >= toHour) {
      setError("שעת התחלה חייבת להיות לפני שעת סיום");
      return;
    }

    if (isOverlapping(fromHour, toHour)) {
      setError("הטווח שהוזן כבר תפוס!");
      return;
    }

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

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || "שגיאה בהזמנה");
      }

      console.log("lets create notfication after create reservation");
      await dispatch(fetchNotifications());

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
            SelectProps={{
              open: fromOpen,
              onOpen: () => setFromOpen(true),
              onClose: () => setFromOpen(false),
              MenuProps: { PaperProps: { sx: { maxHeight: 400 } } },
            }}
          >

            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setFromOpen(false);
              }}
              sx={{ display: "flex", justifyContent: "flex-end", borderBottom: "1px solid #ddd" }}
            >
              ✖ סגור
            </MenuItem>

            {hours.map((h) => {
              let disabled = false;
              let sx = {};

              if (startHours.includes(h) || middleHours.includes(h)) {
                disabled = true;
                if (startHours.includes(h)) sx = { borderBottom: "3px solid red" };
                else if (middleHours.includes(h)) sx = { backgroundColor: "#ddd" };
              }

              return (
                <MenuItem
                  key={h}
                  value={h}
                  disabled={disabled}
                  sx={{
                    ...sx,
                    backgroundColor: disabled ? "#f0f0f0" : "inherit",
                    color: disabled ? "#999" : "inherit",
                  }}
                >
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
            SelectProps={{
              open: toOpen,
              onOpen: () => setToOpen(true),
              onClose: () => setToOpen(false),
              MenuProps: { PaperProps: { sx: { maxHeight: 400 } } },
            }}
          >

            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setToOpen(false);
              }}
              sx={{ display: "flex", justifyContent: "flex-end", borderBottom: "1px solid #ddd" }}
            >
              ✖ סגור
            </MenuItem>

            {hours.map((h) => {
              let disabled = false;
              let sx = {};

              if (endHours.includes(h)) {
                disabled = true;
                sx = { borderTop: "3px solid blue" };
              } else if (middleHours.includes(h)) {
                disabled = true;
                sx = { backgroundColor: "#ddd" };
              }

              return (
                <MenuItem
                  key={h}
                  value={h}
                  disabled={disabled}
                  sx={{
                    ...sx,
                    backgroundColor: disabled ? "#f0f0f0" : "inherit",
                    color: disabled ? "#999" : "inherit",
                  }}
                >
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
