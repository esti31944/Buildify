import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../features/notifications/notificationsSlice";

import { Box, Paper, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';


export default function Notifications() {
    const dispatch = useDispatch();
    const { list, loading } = useSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 3 }}>
            <Table sx={{ direction: "rtl", "& td, & th": { textAlign: "center" } }}>
                <TableHead>
                    <TableRow>
                        <TableCell>סוג</TableCell>
                        <TableCell>תאריך</TableCell>
                        <TableCell>הודעה</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {list.map((n) => (
                        <TableRow
                            key={n._id}
                            sx={{
                                bgcolor: n.isRead ? "#fff" : "#fff7f7",
                            }}
                        >
                            <TableCell>{n.type}</TableCell>
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
                                    <DraftsOutlinedIcon
                                        onClick={() => dispatch(markAsRead(n._id))}
                                    />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
