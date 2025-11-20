import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "80vh",
  overflowY: "auto",
};

export default function MyReservationsModal({ onClose }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("לא נמצא טוקן משתמש");
      setLoading(false);
      return;
    }

    let userId = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload._id || payload.id;
    } catch {
      setError("טוקן לא תקין");
      setLoading(false);
      return;
    }

    async function fetchReservations() {
      try {
        const res = await fetch(
          `http://localhost:3001/reservations/list?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("בעיה בטעינת ההזמנות");

        const data = await res.json();
        setReservations(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchReservations();
  }, []);

  async function handleDelete(id, dateStr) {
    // המרת תאריך להזמנה ל-Date
    const reservationDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // לאפס זמן לשעה 00:00

    // בדיקה אם התאריך עבר
    if (reservationDate < today) {
      setError("לא ניתן למחוק הזמנה מתאריך שעבר.");
      return;
    }

    // אישור מחיקה
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק הזמנה זו?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("לא נמצא טוקן משתמש");
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:3001/reservations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "שגיאה במחיקת ההזמנה");
      }

      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ textAlign: "right", width: "100%" }}
          >
            ההזמנות שלי
          </Typography>

          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "right" }}>
            {error}
          </Typography>
        )}

        {!loading && !error && reservations.length === 0 && (
          <Typography sx={{ textAlign: "right" }}>אין הזמנות להצגה.</Typography>
        )}

        {!loading && !error && reservations.length > 0 && (
          <List>
            {reservations.map((resv) => (
              <ListItem
                key={resv._id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(resv._id, resv.date)}
                    disabled={deletingId === resv._id}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`חדר: ${resv.roomId.name || resv.roomId}`}
                  secondary={
                    <>
                      <div>{`תאריך: ${new Date(
                        resv.date
                      ).toLocaleDateString()}`}</div>
                      <div>{`שעה: ${resv.timeSlot.from} - ${resv.timeSlot.to}`}</div>
                    </>
                  }
                  sx={{ textAlign: "right" }}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button variant="outlined" onClick={onClose}>
            סגור
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
