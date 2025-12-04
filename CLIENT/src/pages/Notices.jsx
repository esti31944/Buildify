import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice as deleteNoticeAction
} from "../features/notice/NoticeSlice";

import TabLabel from "../components/TabLabel";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Paper, Box, Typography, IconButton, Tabs, Tab, } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchNotifications } from '../features/notifications/notificationsSlice';

function StickyNoteCard({ title, children, color = "#FFFFFF" }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        background: color,
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.15)",
        transform: "rotate(-1.5deg)",
        transition: "0.2s",
        position: "relative",
        ":hover": {
          transform: "rotate(0deg)",
          boxShadow: "0 6px 10px rgba(0,0,0,0.22)",
        },
        textAlign: "right",
        overflowWrap: "break-word",
        wordBreak: "break-word",
      }}
      dir="rtl"
    >
      <div
        style={{
          position: "absolute",
          top: -10,
          right: 10,
          fontSize: "24px",
          transform: "rotate(15deg)",
          pointerEvents: "none",
        }}
      >
        📌
      </div>

      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        {title}
      </Typography>

      <Box sx={{ fontSize: "15px", overflowWrap: "break-word" }}>
        {children}
      </Box>
    </Paper>
  );
}

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

  // נשמור את הערך של הטאב הנבחר (all, event, announcement)
  const [filterCategory, setFilterCategory] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcement",
    expiresAt: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setCurrentUser(parseJwt(token));
  }, []);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  function handleChangeForm(e) {
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
      await dispatch(fetchNotifications());
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
    await dispatch(fetchNotifications());
  }

  // חישוב מספר הפריטים בכל קטגוריה
  const counts = {
    all: notices.length,
    event: notices.filter(n => n.category === "event").length,
    announcement: notices.filter(n => n.category === "announcement").length,
  };

  const filteredNotices = notices.filter((n) => {
    if (filterCategory === "all") return true;
    return n.category === filterCategory;
  });

  if (loading) return <div dir="rtl">טוען מודעות...</div>;
  if (error) return <div dir="rtl">שגיאה: {error}</div>;

  // עזרה ל-MUI Tabs כדי שיתמוך בערכים של מחרוזות במקום אינדקסים
  function handleTabChange(event, newValue) {
    setFilterCategory(newValue);
  }

  return (
    <div dir="rtl" style={{ textAlign: "right" }}>
      <h1>לוח מודעות</h1>

      {/* טאב עם מספרים */}
      <Tabs
        value={filterCategory}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{ justifyContent: "flex-end", display: "flex" }}
      >
        <Tab label={<TabLabel title="כל ההודעות" count={counts.all} />} value="event" />
        <Tab label={<TabLabel title="ארועים" count={counts.event} />} value="event" />
        <Tab label={<TabLabel title="הודעות" count={counts.announcement} />} value="event" />
      </Tabs>

      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <Button variant="contained" onClick={() => setShowForm(true)}>
          ➕ הוסף מודעה
        </Button>
      </div>

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
              onChange={handleChangeForm}
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
              onChange={handleChangeForm}
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
              onChange={handleChangeForm}
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
              onChange={handleChangeForm}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
          padding: 10,
        }}
      >
        {filteredNotices.map((n) => {
          const canManage =
            currentUser &&
            (currentUser.role === "admin" || currentUser._id === n.createdBy);

          return (
            <StickyNoteCard
              key={n._id}
              title={n.title}
              color="#FFFFFF"
            >
              <div>{n.content}</div>

              <small style={{ color: "#666", marginTop: 6, display: "block" }}>
                סוג: {n.category === "event" ? "אירוע" : "הודעה"}
              </small>

              {n.expiresAt && (
                <small style={{ color: "#999", display: "block" }}>
                  פג תוקף ב: {new Date(n.expiresAt).toLocaleDateString()}
                </small>
              )}

              {n.createdAt && (
                <small style={{ color: "#999", display: "block" }}>
                  נוצר ב: {new Date(n.createdAt).toLocaleDateString()}
                </small>
              )}

              {canManage && (
                <div style={{ marginTop: 10, textAlign: "right" }}>
                  <IconButton
                    aria-label="edit"
                    color="warning"
                    onClick={() => startEdit(n)}
                    size="small"
                    style={{ marginRight: 8 }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => deleteNotice(n._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
            </StickyNoteCard>
          );
        })}
      </div>
    </div>
  );
}
