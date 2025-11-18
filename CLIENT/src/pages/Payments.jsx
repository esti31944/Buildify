import React, { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPayments } from "../features/Payments/Paymentslice";
import * as XLSX from "xlsx";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function PaymentsDashboard() {
    const dispatch = useDispatch();
    const { list: payments, loading } = useSelector((state) => state.payments);

    const [displayedPayments, setDisplayedPayments] = useState([]);

    useEffect(() => {
        dispatch(fetchMyPayments());
    }, [dispatch]);

    useEffect(() => {
        setDisplayedPayments(payments);
    }, [payments]);

    const unpaidCount = payments.filter((p) => p.status === "unpaid").length;

    /* --- יצירת גרף תשלומים אמיתי לפי חודשים --- */
    const monthlyData = React.useMemo(() => {
        const monthsHeb = [
            "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
            "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
        ];

        const map = {};

        payments.forEach((p) => {
            if (!p.date) return;
            const d = new Date(p.date);
            const m = monthsHeb[d.getMonth()];
            if (!map[m]) map[m] = 0;
            map[m] += p.amount || 0;
        });

        return monthsHeb
            .filter((m) => map[m])
            .map((m) => ({ month: m, amount: map[m] }));
    }, [payments]);

    const renderStatus = (status) => {
        const isPaid = status === "שולם";

        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    width: "fit-content",
                    backgroundColor: isPaid
                        ? "rgba(174, 216, 175, 0.25)"
                        : "rgba(255, 200, 150, 0.25)",
                }}
            >
                {isPaid ? (
                    <CheckCircleIcon sx={{ color: "green" }} />
                ) : (
                    <HourglassEmptyIcon sx={{ color: "orange" }} />
                )}

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: "bold",
                        color: isPaid ? "green" : "orange",
                    }}
                >
                    {status}
                </Typography>
            </Box>
        );
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(displayedPayments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
        XLSX.writeFile(workbook, "payments.xlsx");
    };

    return (
        <Box sx={{ width: "100%", p: 2 }}>
            <Typography variant="h5" gutterBottom>
                התשלומים שלי 💳
            </Typography>
            <Typography variant="body2" gutterBottom color="text.secondary">
                עקוב אחר כל התשלומים וההיסטוריה המלאה
            </Typography>

            <Grid container spacing={2} mt={1} mb={3}>
                <Grid item xs={12} sm={12} md={4.0}>
                    <Paper
                        onClick={() => setDisplayedPayments(payments)}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: 4,
                            backgroundColor: "rgba(169, 211, 245, 0.8)",
                            textAlign: "center",
                            cursor: "pointer",
                            height: 200,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="h3">💳</Typography>
                        <Typography variant="h5" fontWeight="bold">
                            ₪{payments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)}
                        </Typography>
                        <Typography>סה"כ תשלומים: {payments.length}</Typography>
                    </Paper>
                </Grid>

                {/* כרטיס 2 */}
                <Grid item xs={12} sm={12} md={4}>
                    <Paper
                        onClick={() =>
                            setDisplayedPayments(payments.filter((p) => p.status === "unpaid"))
                        }
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: 4,
                            backgroundColor: "rgba(255, 180, 180, 0.8)",
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": { boxShadow: 8, transform: "scale(1.02)" },
                            height: 200,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="h3">❌</Typography>
                        <Typography variant="h5" fontWeight="bold">
                            {unpaidCount}
                        </Typography>
                        <Typography>תשלומים שלא שולמו</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            boxShadow: 4,
                            backgroundColor: "rgba(144, 238, 144, 0.8)",
                            textAlign: "center",
                            height: 200,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            גרף תשלומים לפי חודשים
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
            <Paper>
                <Box display="flex" justifyContent="flex-end" p={1}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={exportToExcel}
                    >
                        יצוא לאקסל
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>תיאור</TableCell>
                                <TableCell>חודש</TableCell>
                                <TableCell>סכום</TableCell>
                                <TableCell>תאריך יעד</TableCell>
                                <TableCell>אמצעי תשלום</TableCell>
                                <TableCell>סטטוס</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        טוען...
                                    </TableCell>
                                </TableRow>
                            ) : displayedPayments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        אין תשלומים להצגה
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedPayments.map((payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell>{payment.title}</TableCell>
                                        <TableCell>{payment.month}</TableCell>
                                        <TableCell>₪{payment.amount}</TableCell>
                                        <TableCell>{payment.dueDate}</TableCell>
                                        <TableCell>{payment.paymentMethod}</TableCell>
                                        <TableCell>{renderStatus(payment.status)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
