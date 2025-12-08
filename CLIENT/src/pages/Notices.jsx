import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventIcon from '@mui/icons-material/Event';
import AnnouncementIcon from '@mui/icons-material/Announcement';

import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice as deleteNoticeAction
} from "../features/notice/NoticeSlice";

import TabLabel from "../components/TabLabel";

import { Dialog, DialogTitle, Tooltip, DialogContent, DialogActions, Button, TextField, MenuItem, Paper, Box, Typography, IconButton, Tabs, Tab, } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchNotifications } from '../features/notifications/notificationsSlice';
import AddIcon from '@mui/icons-material/Add';

function StickyNoteCard({ title, children, type }) {
  const stylesByType = {
    event: {
      bg: "linear-gradient(145deg,#e3f2fd,#bbdefb)",
      border: "#90caf9",
      corner: "#64b5f6",
      tag: "#1976d2"
    },
    announcement: {
      bg: "linear-gradient(145deg,#fffde7,#fff9c4)",
      border: "#fff59d",
      corner: "#ffee58",
      tag: "#fbc02d"
    },
  };

  const style = stylesByType[type] || stylesByType.announcement;

  return (
    <Paper
      sx={{
        p: 2.5,
        background: style.bg,
        borderRadius: "10px",
        border: `1px solid ${style.border}`,
        boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
        position: "relative",
        textAlign: "right",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.18)"
        }
      }}
      dir="rtl"
    >

      {/* תיוג קטגוריה */}
      <Box
        sx={{
          position: "absolute",
          top: 6,
          left: 6,
         
        }}
      >
        {type === "event" ? <EventIcon fontSize="small" /> : <AnnouncementIcon fontSize="small" />}
      </Box>

      <Typography variant="h6" fontWeight="bold" mb={1}>
        {title}
      </Typography>

      <Box fontSize="15px">{children}</Box>
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
function CustomTabLabel({ title, count, type }) {
  const Icon = type === "event" ? EventIcon : AnnouncementIcon;

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Icon fontSize="small" />
      <Typography variant="body2">{title}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
        ({count})
      </Typography>
    </Box>
  );
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
    
    <Box dir="rtl" sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f7f9fc", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        לוח מודעות
      </Typography>
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2
  }}
>
      <Tabs
        value={filterCategory}
        onChange={handleTabChange}
        sx={{
          alignItems: "flex-start",
          mb: 2,
          ".MuiTabs-flexContainer": {
            justifyContent: "flex-start",
          },
        }}
      ><Tab label={<CustomTabLabel title="כל ההודעות" count={counts.all} type="announcement" />} value="all" />
        <Tab label={<CustomTabLabel title="אירועים" count={counts.event} type="event" />} value="event" />
        <Tab label={<CustomTabLabel title="הודעות" count={counts.announcement} type="announcement" />} value="announcement" />

      </Tabs>

        <Tooltip title=" הוסף הודעה חדשה">
          <IconButton
            variant="outlined"
            onClick={() => setShowForm(true)}
            sx={{ display: "flex", alignItems: "center", gap: 1, borderRadius: 3, borderColor: "#1976d2 !important", color: "#16acec", backgroundColor: "rgba(25, 118, 210, 0.05)", "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" } }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
</Box>
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 3,
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
              type={n.category}
            >
              <Typography variant="body2" mb={1}>
                {n.content}
              </Typography>

              <Typography variant="caption" color="text.secondary" display="block">
                סוג: {n.category === "event" ? "אירוע" : "הודעה"}
              </Typography>

              {n.expiresAt && (
                <Typography variant="caption" color="text.secondary" display="block">
                  פג תוקף: {new Date(n.expiresAt).toLocaleDateString()}
                </Typography>
              )}

              {n.createdAt && (
                <Typography variant="caption" color="text.secondary" display="block">
                  נוצר: {new Date(n.createdAt).toLocaleDateString()}
                </Typography>
              )}

              {canManage && (
                <Box mt={2} textAlign="right">
                  <IconButton
                    color="warning"
                    onClick={() => startEdit(n)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => deleteNotice(n._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </StickyNoteCard>
          );
        })}
      </Box>
    </Box>
  );

}
