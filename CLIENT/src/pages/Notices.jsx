import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../components/Card";

import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice as deleteNoticeAction
} from "../features/notice/NoticeSlice";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function Notices() {
  const dispatch = useDispatch();

  const { list: notices, loading, error } = useSelector(
    (state) => state.notices
  );

  const [currentUser, setCurrentUser] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcement",
    expiresAt: ""
  });

  const [editingId, setEditingId] = useState(null);

  // --- פענוח טוקן ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setCurrentUser(parseJwt(token));
  }, []);

  // --- טעינת המודעות ---
  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("אנא מלא את כל השדות");
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
    };

    if (formData.expiresAt) payload.expiresAt = formData.expiresAt;

    if (editingId) {
      await dispatch(updateNotice({ id: editingId, data: payload }));
    } else {
      await dispatch(createNotice(payload));
    }

    setFormData({
      title: "",
      content: "",
      category: "announcement",
      expiresAt: ""
    });

    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(n) {
    setEditingId(n._id);
    setFormData({
      title: n.title,
      content: n.content,
      category: n.category,
      expiresAt: n.expiresAt ? n.expiresAt.split("T")[0] : "",
    });
    setShowForm(true);
  }

  async function deleteNotice(id) {
    if (!window.confirm("האם למחוק את ההודעה?")) return;
    await dispatch(deleteNoticeAction(id));
  }

  if (loading) return <div style={{ textAlign: "right" }} dir="rtl">טוען מודעות...</div>;
  if (error) return <div style={{ textAlign: "right" }} dir="rtl">שגיאה: {error}</div>;

  return (
    <div dir="rtl" style={{ textAlign: "right" }}>
      <h1>לוח מודעות</h1>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          ➕ הוסף מודעה
        </Button>
      </div>

      {/* מודל MUI לטופס */}
      <Dialog
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingId(null);
        }}
        dir="rtl"
      >
        <DialogTitle style={{ textAlign: "right" }}>
          {editingId ? "עדכון מודעה" : "הוספת מודעה חדשה"}
        </DialogTitle>

        <DialogContent dividers>
          <form id="notice-form" onSubmit={handleSubmit} style={{ minWidth: 400 }}>
            <TextField
              autoFocus
              margin="dense"
              label="כותרת *"
              name="title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleChange}
              required
              inputProps={{ style: { textAlign: "right" } }}
            />

            <TextField
              margin="dense"
              label="תוכן *"
              name="content"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={formData.content}
              onChange={handleChange}
              required
              inputProps={{ style: { textAlign: "right" } }}
            />

            <TextField
              margin="dense"
              label="סוג הודעה"
              name="category"
              select
              fullWidth
              variant="outlined"
              value={formData.category}
              onChange={handleChange}
              SelectProps={{ style: { textAlign: "right" } }}
            >
              <MenuItem value="event">אירוע</MenuItem>
              <MenuItem value="announcement">הודעה</MenuItem>
            </TextField>

            <TextField
              margin="dense"
              label="תאריך תפוגה (אופציונלי)"
              name="expiresAt"
              type="date"
              fullWidth
              variant="outlined"
              value={formData.expiresAt}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
                style: { textAlign: "right" }
              }}
              inputProps={{ style: { textAlign: "right" } }}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
            }}
          >
            ביטול
          </Button>

          <Button type="submit" form="notice-form" variant="contained">
            שמור
          </Button>
        </DialogActions>
      </Dialog>

      {/* רשימת מודעות */}
      <div style={{ display: "grid", gap: 12 }}>
        {notices.map((n) => {
          const canManage =
            currentUser &&
            (currentUser.role === "admin" || currentUser._id === n.createdBy);

          return (
            <Card key={n._id} title={n.title} style={{ textAlign: "right" }}>
              <div>{n.content}</div>

              <small style={{ color: "#666", marginTop: 6, display: "block", textAlign: "right" }}>
                סוג: {n.category === "event" ? "אירוע" : "הודעה"}
              </small>

              {n.expiresAt && (
                <small style={{ color: "#999", display: "block", textAlign: "right" }}>
                  פג תוקף ב: {new Date(n.expiresAt).toLocaleDateString()}
                </small>
              )}

              {canManage && (
                <div style={{ marginTop: 10, textAlign: "right" }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => startEdit(n)}
                    style={{ marginRight: 8 }}
                  >
                    ✏️ עדכן
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteNotice(n._id)}
                  >
                    🗑️ מחק
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
