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
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PaymentIcon from "@mui/icons-material/Payment";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const IconWrapper = ({ icon, color, bgOpacity = "13" }) => (
    <Box
        sx={{
            width: 32,
            height: 10,
            borderRadius: "30%",
            bgcolor: color + bgOpacity,
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
                { to: "/", label: "דף הבית", icon: <HomeOutlinedIcon />, color: "#1976d2" },
                { to: "/payments", label: "תשלומים", icon: <PaymentIcon />, color: "#0097A7" },
                { to: "/issues", label: "תקלות", icon: <ErrorOutlineOutlinedIcon />, color: "#388e3c" },
                { to: "/documents", label: "חדרים", icon: <MeetingRoomOutlinedIcon />, color: "#fbc02d" },
                { to: "/notices", label: "לוח מודעות", icon: <ChatBubbleOutlineOutlinedIcon />, color: "#fb8c00" },
                { to: "/notifications", label: "התראות", icon: <NotificationsNoneOutlinedIcon />, color: "#d32f2f" },
                { to: "/tenants", label: "ניהול דיירים", icon: <GroupOutlinedIcon />, color: "#7b1fa2" },
            ]
            : [
                { to: "/", label: "דף הבית", icon: <HomeOutlinedIcon />, color: "#1976d2" },
                { to: "/payments", label: "התשלומים שלי", icon: <PaymentIcon />, color: "#0097A7" },
                { to: "/issues", label: "התקלות שלי", icon: <ErrorOutlineOutlinedIcon />, color: "#388e3c" },
                { to: "/documents", label: "חדרים", icon: <MeetingRoomOutlinedIcon />, color: "#fbc02d" },
                { to: "/notices", label: "לוח מודעות", icon: <ChatBubbleOutlineOutlinedIcon />, color: "#fb8c00" },
                { to: "/notifications", label: "התראות", icon: <NotificationsNoneOutlinedIcon />, color: "#d32f2f" },
                { to: "/tenants", label: "שכנים", icon: <GroupOutlinedIcon />, color: "#7b1fa2" },
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

                overflow: "hidden",

                transition: "transform 0.35s ease-in-out",
            }}
        >

            {/* כפתור סגירה במובייל */}
            {isMobile && (
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}>
                    <CloseRoundedIcon />
                </IconButton>
            )}

            <Box sx={{ flexShrink: 0, mb: 2 }}>
                <img src={Logo} alt="Logo" style={{ maxWidth: "100%", display: "block" }} />
            </Box>

            {/* ניווט */}
            <Box sx={{
                display: "flex", flexDirection: "column", gap: 1,
                gap: 0.15,
                flex: 1,
                overflowY: "auto", // גלילה רק בחלק הניווט
                overflowX: "hidden",
                pr: 0.5, // רווח קטן לסקרולבר
                // סטיילינג לסקרולבר (אופציונלי)
                "&::-webkit-scrollbar": {
                    width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "3px",
                },
            }}>
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
                            flexShrink: 0,
                            "&.active": { bgcolor: "#e0e0e0" },
                            "&:hover": { bgcolor: "#f5f5f5" },
                        }}
                    >

                        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                            {/* אייקון + טקסט */}
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <IconWrapper icon={l.icon} color={l.color} />
                                <Box sx={{ width: 16 }} />
                                <Typography sx={{fontSize:12, fontWeight:600}}>
                                    {l.label}
                                </Typography>
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

            <Divider sx={{ my: 2, bgcolor: "#ccc", flexShrink: 0 }} />

            <Box sx={{ flexShrink: 0 }}>
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
