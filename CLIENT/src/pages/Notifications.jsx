import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../features/notifications/notificationsSlice";

import { Box, Paper, Typography, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";

export default function Notifications() {
    const dispatch = useDispatch();
    const { list, loading } = useSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">התראות</Typography>

                {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch(markAllAsRead())}
                >
                    סמן הכל כנקרא
                </Button> */}
            </Box>

            <Table sx={{ direction: "rtl", "& td, & th": { textAlign: "center" } }}>
                <TableHead>
                    <TableRow>
                        <TableCell>סוג</TableCell>
                        <TableCell>הודעה</TableCell>
                        <TableCell>סטטוס</TableCell>
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
                            <TableCell>{n.message}</TableCell>
                            <TableCell>
                                {n.isRead ? "נקראה" : "חדשה"}
                            </TableCell>
                            <TableCell>
                                {!n.isRead && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => dispatch(markAsRead(n._id))}
                                    >
                                        סמן כנקרא
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
