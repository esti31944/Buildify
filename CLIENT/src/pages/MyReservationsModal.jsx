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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("לא נמצא טוקן משתמש");
      setLoading(false);
      return;
    }

    // חילוץ userId מהטוקן (JWT)
    let userId = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload._id || payload.id; // תוודא את השדה הנכון לפי הטוקן שלך
    } catch {
      setError("טוקן לא תקין");
      setLoading(false);
      return;
    }

    async function fetchReservations() {
      try {
        const res = await fetch(`http://localhost:3001/reservations/list?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" component="h2">
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
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && reservations.length === 0 && (
          <Typography>אין הזמנות להצגה.</Typography>
        )}

        {!loading && !error && reservations.length > 0 && (
          <List>
            {reservations.map((resv) => (
              <ListItem key={resv._id} divider>
                <ListItemText
                  primary={`חדר: ${resv.roomId.name || resv.roomId}`}
                  secondary={
                    <>
                      <div>{`תאריך: ${new Date(resv.date).toLocaleDateString()}`}</div>
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
