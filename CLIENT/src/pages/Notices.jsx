import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventIcon from '@mui/icons-material/Event';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EventBusyIcon from "@mui/icons-material/EventBusy";

import {
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice as deleteNoticeAction
} from "../features/notice/NoticeSlice";

import TabLabel from "../components/TabLabel";

import { Dialog, Divider, DialogTitle, Tooltip, DialogContent, DialogActions, Button, TextField, MenuItem, Paper, Box, Typography, IconButton, Tabs, Tab, Snackbar, Alert } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchNotifications } from '../features/notifications/notificationsSlice';
import AddIcon from '@mui/icons-material/Add';

function StickyNoteCard({ title, children, type }) {
  const stylesByType = {
    event: {
      bg: "linear-gradient(145deg,#fffde7,#fff9c4)",
      border: "#fff59d",
      corner: "#ffee58",
      tag: "#fbc02d"
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

function CustomTabLabel({ title, count, type, faded = false }) {
  const Icon = type === "event" ? EventIcon : type === "expired" ? EventBusyIcon : AnnouncementIcon;

  return (
    <Box display="flex" alignItems="center" gap={0.5}
      sx={{
        color: faded ? "text.disabled" : "text.primary",
      }}
    >
      <Icon fontSize="small" />
      <Typography variant="body2">{title}</Typography>
      <Typography variant="caption" color={faded ? "text.disabled" : "text.secondary"} sx={{ ml: 0.5 }}>
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

  // נשמור את הערך של הטאב הנבחר (expired, all, event, announcement)
  const [filterCategory, setFilterCategory] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcement",
    expiresAt: ""
  });

  const [editingId, setEditingId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  function confirmDelete(id) {
    setDeleteDialog({ open: true, id });
  }
  async function handleDeleteConfirmed() {
    if (deleteDialog.id) {
      await dispatch(deleteNoticeAction(deleteDialog.id));
      await dispatch(fetchNotifications());
      setSnackbar({ open: true, message: "המודעה נמחקה", severity: "info" });
    }
    setDeleteDialog({ open: false, id: null });
  }

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
      // alert("אנא מלא את כל השדות");
      setSnackbar({ open: true, message: "אנא מלא את כל השדות", severity: "error" });
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
    };

    if (formData.expiresAt) payload.expiresAt = formData.expiresAt;

    try {
      if (editingId) {
        await dispatch(updateNotice({ id: editingId, data: payload })).unwrap();
        setSnackbar({ open: true, message: "המודעה עודכנה בהצלחה", severity: "success" });
      } else {
        await dispatch(createNotice(payload));
        setSnackbar({ open: true, message: "מודעה חדשה נוצרה בהצלחה", severity: "success" });
      }
      await dispatch(fetchNotices());
      await dispatch(fetchNotifications());
      setFormData({ title: "", content: "", category: "announcement", expiresAt: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setSnackbar({ open: true, message: "שגיאה בשמירת המודעה", severity: "error" });
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
    // if (!window.confirm("האם למחוק את ההודעה?")) return;
    if (deleteDialog.id) {
      // await dispatch(deleteNoticeAction(id));
      await dispatch(deleteNoticeAction(deleteDialog.id));
      setSnackbar({ open: true, message: "המודעה נמחקה", severity: "info" });
      await dispatch(fetchNotifications());
    }
    setDeleteDialog({ open: false, id: null });
  }

  // חישוב מספר הפריטים בכל קטגוריה
  const counts = {
    all: notices.length,
    event: notices.filter(n => n.category === "event").length,
    announcement: notices.filter(n => n.category === "announcement").length,
    expired: notices.filter(n => isExpired(n)).length,
  };

  function isExpired(notice) {
    if (!notice.expiresAt) return false;
    return new Date(notice.expiresAt) < new Date();
  }

  const filteredNotices = notices.filter((n) => {
    const expired = isExpired(n);
    if (currentUser?.role !== "admin") {
      return !expired;
    }
    if (filterCategory === "expired") {
      return expired;
    }
    if (filterCategory === "all") {
      return !expired;
    }
    if (filterCategory === "event") {
      return n.category === "event" && !expired;
    }
    if (filterCategory === "announcement") {
      return n.category === "announcement" && !expired;
    }
    return true;
    // if (filterCategory === "all") return true;
    // return n.category === filterCategory;
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
        >
          <Tab label={<CustomTabLabel title="כל ההודעות" count={counts.all} type="announcement" />} value="all" />
          <Tab label={<CustomTabLabel title="אירועים" count={counts.event} type="event" />} value="event" />
          <Tab label={<CustomTabLabel title="הודעות" count={counts.announcement} type="announcement" />} value="announcement" />
          {currentUser?.role === "admin" && (
            <Tab value="expired" label={<CustomTabLabel title="מודעות שפג תוקפן" count={counts.expired} type="expired" faded/>} />
          )}
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
        fullWidth
        sx={{ direction: "rtl" }}
      >
        <Box className="fault-report-card" sx={{ p: 2 }}>
          {/* Header */}
          <Box
            className="fault-report-header"
            sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
          >
            <Box className="fault-report-icon-wrapper">
              <AnnouncementIcon />
            </Box>

            <Typography className="fault-report-title">
              {editingId ? "עדכון מודעה" : "הוספת מודעה חדשה"}
            </Typography>
          </Box>

          {/* Content */}
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="fault-report-field">
              <label className="fault-report-label">כותרת</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChangeForm}
                className="fault-report-input"
                placeholder="הזן כותרת"
              />
            </div>

            <div className="fault-report-field">
              <label className="fault-report-label">תוכן</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChangeForm}
                rows={4}
                className="fault-report-input"
                placeholder="הזן תוכן מודעה"
              />
            </div>

            <div className="fault-report-field">
              <label className="fault-report-label">סוג הודעה</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChangeForm}
                className="fault-report-input"
              >
                <option value="announcement">הודעה</option>
                <option value="event">אירוע</option>
              </select>
            </div>

            <div className="fault-report-field">
              <label className="fault-report-label">תאריך תפוגה (אופציונלי)</label>
              <input
                type="date"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChangeForm}
                className="fault-report-input"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </DialogContent>

          {/* Actions */}
          <DialogActions sx={{ justifyContent: "space-between", px: 2 }}>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="fault-report-cancel-btn"
            >
              ביטול
            </button>

            <button
              type="submit"
              form="notice-form"
              className="fault-report-submit-btn"
              onClick={handleSubmit}
            >
              שמור
            </button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle sx={{ textAlign: "right" }}>
          אישור מחיקה
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: "right" }}>
            ?האם אתה בטוח שברצונך למחוק את המודעה
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>ביטול</Button>
          <Button color="error" onClick={handleDeleteConfirmed}>מחק</Button>
        </DialogActions>
      </Dialog>


      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 4,
          p: 3,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        }}
      >
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

              <StickyNoteCard key={n._id} title={n.title} type={n.category} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Paper
                  sx={{ display: "flex", flexDirection: "column", height: 250, p: 2 }}
                // key={n._id}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Typography variant="body2" mb={1}>
                      {n.content}
                    </Typography>

                    <Box sx={{ mt: "auto" }}>
                      <Divider sx={{ borderColor: "#d9d6d6ff" }} />
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
                        <Box mt={1} textAlign="right">
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
                            onClick={() => confirmDelete(n._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </StickyNoteCard>

            );
          })}

        </Box>
      </Box>
    </Box>
  );

}
