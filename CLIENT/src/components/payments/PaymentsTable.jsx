// components/payments/PaymentsTable.jsx
import {
    Box, TextField, IconButton, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, TableContainer, Paper, Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentStatus } from "../../features/Payments/Paymentslice";

import * as XLSX from "xlsx";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';

export default function PaymentsTable({


    search, setSearch, filteredPayments, loading,
    user, handleOpen, handleDelete
}) {
    const dispatch = useDispatch()
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredPayments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
        XLSX.writeFile(workbook, "payments.xlsx");
    };
    const statusMap = {
        unpaid: "לא שולם",
        pending: "בהמתנה",
        paid: "שולם"
    };

    const showPaidColumn = filteredPayments.some(p => p.status === "paid");

    return (
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

            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TextField
                    fullWidth
                    placeholder="חפש לפי כותרת, חודש או סכום..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <Typography fontWeight={600}>כל התשלומים</Typography>
            </Box>

            <TableContainer>

                <Table sx={{ direction: "rtl", "& td, & th": { textAlign: "center" } }}>
                    <TableHead>
                        <TableRow>
                            {user?.role === "admin" && <TableCell>ניהול</TableCell>}
                            {user?.role === "admin" && <TableCell>שם הדייר</TableCell>}
                            <TableCell>תיאור</TableCell>
                            <TableCell>תאריך</TableCell>
                            <TableCell>סכום</TableCell>
                            <TableCell>סטטוס</TableCell>
                            <TableCell>פעולות</TableCell>
                            {showPaidColumn && <TableCell>שולם בתאריך</TableCell>}
                            {showPaidColumn && <TableCell>אמצעי תשלום</TableCell>}

                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    טוען...
                                </TableCell>
                            </TableRow>
                        ) : filteredPayments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    אין תשלומים להצגה
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment._id}>


                                    {user?.role === "admin" && (

                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleOpen(payment)}
                                                disabled={payment.status!=="unpaid"} 
                                            >
                                                <EditIcon color={payment.status==="unpaid" ? "warning" : "disabled"} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(payment._id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </TableCell>


                                    )}

                                    {user?.role === "admin" && (
                                        <TableCell>


                                            {payment.userId?.fullName}
                                        </TableCell>
                                    )}

                                    <TableCell>{payment.title}</TableCell>

                                    <TableCell>
                                        {new Date(payment.month).toLocaleDateString("he-IL", {
                                            year: "numeric",
                                            month: "long"
                                        })}
                                    </TableCell>

                                    <TableCell>₪{payment.amount}</TableCell>

                                    <TableCell>{statusMap[payment.status]}</TableCell>



                                    <TableCell>
                                        {payment.status === "paid" && (
                                            <CheckCircleIcon color="success" />
                                        )}

                                        {payment.status === "pending" && user?.role !== "admin" && (
                                            <HourglassEmptyIcon color="warning" />
                                        )}
                                        {payment.status === "unpaid" && user?.role === "admin" && (
                                            <CancelIcon color="error" />
                                        )}

                                        {/* לחצן לחיצה עבור משתמשים */}
                                        {(user?.role !== "admin" && payment.status === "unpaid") ? (
                                            <IconButton
                                                size="small"
                                                onClick={async () => {
                                                    const confirmChange = window.confirm(
                                                        "האם אתה בטוח שהתשלום הועבר?"
                                                    );
                                                    if (!confirmChange) return;

                                                    try {
                                                        dispatch(updatePaymentStatus({
                                                            id: payment._id,
                                                            status: "pending"
                                                        }));
                                                        alert("סטטוס עודכן בהצלחה!");
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert("שגיאה בעדכון הסטטוס");
                                                    }
                                                }}
                                                sx={{
                                                    backgroundColor: "rgba(0,0,0,0.05)",
                                                    borderRadius: "50%",
                                                    cursor: "pointer",
                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" }
                                                }}
                                            >
                                                <CancelIcon color="error" />                                            </IconButton>
                                        ) : (user?.role === "admin" && payment.status === "pending") ? (
                                            <IconButton
                                                size="small"
                                                onClick={async () => {
                                                    const confirmChange = window.confirm(
                                                        "האם אתה בטוח שהתשלום הועבר?"
                                                    );
                                                    if (!confirmChange) return;

                                                    try {
                                                        dispatch(updatePaymentStatus({
                                                            id: payment._id,
                                                            status: "paid"
                                                        }));
                                                        alert("סטטוס עודכן בהצלחה!");
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert("שגיאה בעדכון הסטטוס");
                                                    }
                                                }}
                                                sx={{
                                                    backgroundColor: "rgba(0,0,0,0.05)",
                                                    borderRadius: "50%",
                                                    cursor: "pointer",
                                                    "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" }
                                                }}
                                            >
                                                <HourglassEmptyIcon color="warning" fontSize="small" />
                                            </IconButton>
                                        ) : null}
                                    </TableCell>
                                    {payment.status === "paid" && (
                                        <TableCell>
                                            {new Date(payment.paymentDate).toLocaleDateString("he-IL", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </TableCell>
                                    )}

                                    {payment.status === "paid" && (
                                        <TableCell>{payment.paymentMethod}</TableCell>
                                    )}

                                </TableRow>
                            ))
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
        </Paper>
    );
}
