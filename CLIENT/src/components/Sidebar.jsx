// src>components>Sidebar.js
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications, selectUnreadCount, clearNotifications } from "../features/notifications/notificationsSlice";
import { logout } from "../features/auth/authSlice";
import { Box, Paper, Typography, Button, Divider, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Logo from "../assets/logo_remove.png";

// אייקונים
import HomeIcon from "@mui/icons-material/Home";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PaymentIcon from "@mui/icons-material/Payment";
import FolderIcon from "@mui/icons-material/Folder";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";

const IconWrapper = ({ icon, color }) => (
    <Box
        sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: color + "33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        {React.cloneElement(icon, { style: { color: color, fontSize: 20 } })}
    </Box>
);

export default function Sidebar({ isMobile, onClose }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, []);

    const unreadCount = useSelector(selectUnreadCount);

    const links =
        user?.role === "admin"
            ? [
                { to: "/", label: "דף הבית", icon: <HomeIcon />, color: "#1976d2" },
                { to: "/issues", label: "תקלות", icon: <ReportProblemIcon />, color: "#0097A7" },
                { to: "/payments", label: "תשלומים", icon: <PaymentIcon />, color: "#388e3c" },
                { to: "/documents", label: "חדרים", icon: <FolderIcon />, color: "#fbc02d" },
                { to: "/notices", label: "לוח מודעות", icon: <EventNoteIcon />, color: "#fb8c00" },
                { to: "/notifications", label: "התראות", icon: <NotificationsIcon />, color: "#d32f2f" },
                { to: "/tenants", label: "ניהול דיירים", icon: <PeopleIcon />, color: "#7b1fa2" },
            ]
            : [
                { to: "/", label: "הבית שלי", icon: <HomeIcon />, color: "#1976d2" },
                { to: "/issues", label: "התקלות שלי", icon: <ReportProblemIcon />, color: "#0097A7" },
                { to: "/payments", label: "התשלומים שלי", icon: <PaymentIcon />, color: "#388e3c" },
                { to: "/documents", label: "חדרים", icon: <FolderIcon />, color: "#fbc02d" },
                { to: "/notices", label: "לוח מודעות", icon: <EventNoteIcon />, color: "#fb8c00" },
                { to: "/notifications", label: "התראות", icon: <NotificationsIcon />, color: "#d32f2f" },
                { to: "/tenants", label: "שכנים", icon: <PeopleIcon />, color: "#7b1fa2" },
            ];

    return (
        <Paper
            elevation={8}
            sx={{
                width: 240,
                p: 3,
                borderRadius: 4,
                bgcolor: "#fff",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                height: isMobile ? "100vh" : "calc(100vh - 56px)",

                position: isMobile ? "fixed" : "sticky",
                top: isMobile ? 0 : 28,
                right: 0,
                zIndex: isMobile ? 2000 : 1500,

                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",

                transition: "transform 0.35s ease-in-out",
            }}
        >

            {/* כפתור סגירה במובייל */}
            {isMobile && (
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10 }}>
                    <CloseRoundedIcon />
                </IconButton>
            )}

            <img src={Logo} alt="Logo" style={{ maxWidth: "100%", marginBottom: 20 }} />


            {/* ניווט */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {links.map((l) => (
                    <Button
                        key={l.to}
                        component={NavLink}
                        to={l.to}
                        fullWidth
                        onClick={() => isMobile && onClose()}
                        sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            color: "#000",
                            borderRadius: 2,
                            py: 1,
                            "&.active": { bgcolor: "#e0e0e0" },
                            "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                    >
                        {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconWrapper icon={l.icon} color={l.color} />
                            <Box sx={{ width: 16 }} />
                            {l.label}
                        </Box> */}
                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                            {/* אייקון + טקסט */}
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <IconWrapper icon={l.icon} color={l.color} />
                                <Box sx={{ width: 16 }} />
                                {l.label}
                            </Box>

                            {/* באדג' רק להתראות */}
                            {l.to === "/notifications" && unreadCount > 0 && (
                                <Box
                                    sx={{
                                        bgcolor: "#d32f2f",
                                        color: "white",
                                        borderRadius: "8px",
                                        fontSize: "11px",
                                        px: 1,
                                        minWidth: "22px",
                                        textAlign: "center",
                                        ml: 1,
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                                    }}
                                >
                                    {unreadCount}
                                </Box>
                            )}
                        </Box>

                    </Button>
                ))}
            </Box>

            <Divider sx={{ my: 2, bgcolor: "#ccc" }} />

            <Box>
                <Typography sx={{ color: "#000", fontSize: 14, mb: 1 }}>
                    {user?.fullName}
                </Typography>
                <Typography sx={{ color: "#777", fontSize: 12, mb: 2 }}>
                    {user?.role === "admin" ? "מנהל" : "דייר"}
                </Typography>

                <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                        py: 1.5,
                        borderRadius: 3,
                        color: "#000",
                        borderColor: "#999",
                        "&:hover": { borderColor: "#000", backgroundColor: "#eee" },
                    }}
                    onClick={() => {
                        dispatch(logout());
                        dispatch(clearNotifications());
                        if (isMobile) onClose();
                    }}
                >
                    התנתק
                </Button>
            </Box>
        </Paper>
    );
}
