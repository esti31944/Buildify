import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  MenuItem,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { fetchNotifications } from "../features/notifications/notificationsSlice";

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

  const [openAlert, setOpenAlert] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  useEffect(() => {
    loadReservations();
  }, [roomId, date]);

  async function loadRoom() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/rooms/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const room = await res.json();
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
      `${import.meta.env.VITE_API_URL}/reservations/list?roomId=${roomId}&date=${date}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      const data = await res.json();
      setReservations(data);
    }
  }

  function generateHours(openingHours) {
    if (!openingHours) return [];

    const [sh, sm] = openingHours.from.split(":").map(Number);
    const [eh, em] = openingHours.to.split(":").map(Number);

    const arr = [];
    let current = sh * 60 + sm;
    const end = eh * 60 + em;

    while (current < end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      arr.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      current += 30;
    }
    return arr;
  }

  function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function isPastHour(hour) {
    if (!date) return false;

    const today = new Date().toISOString().split("T")[0];
    if (date !== today) return false;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return timeToMinutes(hour) <= nowMinutes;
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

    return { startHours, endHours, middleHours };
  }

  function isOverlapping(newFrom, newTo) {
    const f = timeToMinutes(newFrom);
    const t = timeToMinutes(newTo);

    return reservations.some((r) => {
      const rf = timeToMinutes(r.timeSlot.from);
      const rt = timeToMinutes(r.timeSlot.to);
      return f < rt && t > rf;
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
      setError("הטווח שהוזן כבר תפוס");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reservations`, {
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

      await dispatch(fetchNotifications());

      // alert("ההזמנה נשמרה בהצלחה");
      setFormVisible(false); // מסתיר את הטופס
      setOpenAlert(true);
      // setTimeout(() => {
      //   onClose(); // סוגר את הדיאלוג אחרי 3 שניות
      // }, 3000);

      // onClose();

    } catch (err) {
      setError(err.message);
    }
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenAlert(false);
    onClose();
  };

  const hours = openingHours ? generateHours(openingHours) : [];
  const { startHours, endHours, middleHours } = getBusyHoursByType();

  return (
    <>
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        {formVisible && (
          <>

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
          </>
        )}
      </Dialog>
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: "100%" }}>
          ההזמנה נשמרה בהצלחה!
        </Alert>
      </Snackbar>
    </>
  );
}
