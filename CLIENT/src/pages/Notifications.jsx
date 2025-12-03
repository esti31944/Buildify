import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead, deleteNotification } from "../features/notifications/notificationsSlice";

import { Box, Paper, Typography, Button, Tabs, Tab, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';

import PaymentIcon from "@mui/icons-material/Payment";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";


export default function Notifications() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { list, loading } = useSelector((state) => state.notifications);

    const [selectedType, setSelectedType] = React.useState("all");

    const showTypeColumn = selectedType === "all";

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    if (loading) return <CircularProgress />;

    const filteredList = selectedType === "all"
        ? list
        : list.filter(n => n.type === selectedType);

    const handleTabChange = (event, newValue) => {
        setSelectedType(newValue);
    };

    const typeIcons = {
        payment: <PaymentIcon sx={{ color: "#6d6d6d", ml: 1 }} />,
        issue: <ReportProblemIcon sx={{ color: "#6d6d6d", ml: 1 }} />,
        room: <MeetingRoomIcon sx={{ color: "#6d6d6d", ml: 1 }} />,
        notice: <EventNoteIcon sx={{ color: "#6d6d6d", ml: 1 }} />,
        system: <InfoOutlinedIcon sx={{ color: "#6d6d6d", ml: 1 }} />,
    };

    const typeLabelsTabs = {
        payment: "תשלומים",
        issue: "תקלות",
        room: "חדרים",
        notice: "מודעות",
        system: "מערכת",
    };

    const typeLabels = {
        payment: "תשלום",
        issue: "תקלה",
        room: "חדר",
        notice: "מודעה",
        system: "מערכת",
    };

    const getTypeIcon = (type) => {

        return (
            <Tooltip title={typeLabels[type] || ""}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {typeIcons[type]}
                </Box>
            </Tooltip>
        );
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
                <Tabs
                    value={selectedType}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ minHeight: 40 }}
                >
                    <Tab label="הכל" value="all" />
                    {Object.keys(typeIcons).map((type) => (
                        <Tab
                            key={type}
                            value={type}
                            icon={typeIcons[type]}
                            iconPosition="start"
                            label={typeLabelsTabs[type]}
                            sx={{ minHeight: 40, paddingY: 0 }}
                        />
                    ))}
                </Tabs>
            </Box>

            <Table sx={{ direction: "rtl", "& td, & th": { textAlign: "center" } }}>
                <TableHead>
                    <TableRow>
                        {showTypeColumn && <TableCell>סוג</TableCell>}
                        <TableCell>תאריך</TableCell>
                        <TableCell>הודעה</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {filteredList.map((n) => (
                        <TableRow
                            key={n._id}
                            sx={{
                                bgcolor: n.isRead ? "#fff" : "#fff7f7",
                            }}
                        >
                            {showTypeColumn && <TableCell>{getTypeIcon(n.type)}</TableCell>}
                            <TableCell>{new Date(n.createdAt).toLocaleString("he-IL", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</TableCell>
                            <TableCell sx={{ textAlign: "right !important" }}>
                                {n.message}
                            </TableCell>
                            <TableCell>
                                {!n.isRead ? (
                                    <Tooltip title="סמן כנקרא">
                                        <MarkEmailUnreadOutlinedIcon sx={{ color: "#424242", cursor: "pointer" }}
                                            onClick={() => dispatch(markAsRead(n._id))}
                                        />
                                    </Tooltip>
                                ) : (
                                    <DraftsOutlinedIcon sx={{ color: "#9e9e9e" }}
                                        onClick={() => dispatch(markAsRead(n._id))}
                                    />
                                )}
                                <Tooltip title="מחק התראה">
                                    <DeleteIcon
                                        sx={{ color: "error.main", cursor: "pointer", opacity: 0.8, mr: 4 }}
                                        onClick={() => dispatch(deleteNotification(n._id))}
                                    />
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
