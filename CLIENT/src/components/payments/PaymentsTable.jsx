import {
    Box, TextField, IconButton, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, TableContainer, Paper, Button, Tooltip, Tabs, Tab
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { useDispatch, useSelector } from "react-redux";
import { updatePaymentStatus } from "../../features/Payments/Paymentslice";
import { fetchNotifications } from '../../features/notifications/notificationsSlice';

import * as XLSX from "xlsx";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import xl from "../../assets/xl.png";
import React, { useRef, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import { store } from "../../app/store"
import { uploadPaymentFile } from "../../features/Payments/Paymentslice";
import FilePreview from "./FilePreview"
export default function PaymentsTable({
    search, setSearch, filteredPayments, loading,
    user, handleOpen, handleDelete
}) {
    const dispatch = useDispatch()
    const exportToExcel = () => {
        // המרת הנתונים לגיליון
        const worksheet = XLSX.utils.json_to_sheet(
            filteredPayments.map(p => ({
                תיאור: p.title,
                חודש: new Date(p.month).toLocaleDateString("he-IL", { year: "numeric", month: "long" }),
                סכום: `₪${p.amount}`,
                סטטוס: statusMap[p.status],
                "תאריך תשלום": p.paymentDate ? new Date(p.paymentDate).toLocaleDateString("he-IL", { day: "2-digit", month: "long", year: "numeric" }) : "",
                "אמצעי תשלום": p.paymentMethod || "",
                "שם הדייר": p.userId?.fullName || ""
            }))
        );

        // יצירת חוברת עבודה
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

        // עיצוב רוחב עמודות
        worksheet["!cols"] = [
            { wch: 30 }, // תיאור
            { wch: 15 }, // חודש
            { wch: 12 }, // סכום
            { wch: 12 }, // סטטוס
            { wch: 15 }, // תאריך תשלום
            { wch: 20 }, // אמצעי תשלום
            { wch: 25 }, // שם הדייר
        ];

        // עיצוב כותרות מודגשות עם צבע רקע קל
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "FFFFCC" } },
                alignment: { horizontal: "center" }
            };
        }

        // שמירת הקובץ
        XLSX.writeFile(workbook, "payments.xlsx");
    };

    const statusMap = {
        unpaid: "לא שולם",
        pending: "בהמתנה",
        paid: "שולם"
    };
    const [tab, setTab] = useState(0); // 0 = unpaid, 1 = pending, 2 = paid
    const filteredByStatus = {
        unpaid: filteredPayments
            .filter(p => p.status === "unpaid")
            .sort((a, b) => new Date(b.month) - new Date(a.month)), // מהחדש לישן
        pending: filteredPayments
            .filter(p => p.status === "pending")
            .sort((a, b) => new Date(b.month) - new Date(a.month)),
        paid: filteredPayments
            .filter(p => p.status === "paid")
            .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)), // מהחדש לישן
    };
    const paymentsToShow =
        tab === 0 ? filteredByStatus.unpaid :
            tab === 1 ? filteredByStatus.pending :
                filteredByStatus.paid;


    const showPaidColumn = filteredPayments.some(p => p.status === "paid");
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // פותח את חלון הבחירה
        } else {
            console.warn("file input לא קיים ברגע זה");
        }
    };

    const handleFileChange = async (e, paymentId) => {
        const file = e.target.files[0];
        if (!file) return;

        // הוספתי רק את זה:
        const confirmChange = window.confirm("האם אתה בטוח שהתשלום הועבר?");
        if (!confirmChange) return;

        try {
            // 1. עדכון סטטוס כמו בכפתור הראשון
            await dispatch(updatePaymentStatus({
                id: paymentId,
                status: "pending"
            })).unwrap();
            await dispatch(fetchNotifications());


            // 2. העלאת הקובץ — הקוד המקורי שלך (לא שיניתי)
            await dispatch(uploadPaymentFile({ paymentId, file })).unwrap();

            alert("סטטוס עודכן והקובץ נשמר בהצלחה!");
        } catch (error) {
            console.error("שגיאה בהעלאה או בעדכון:", error);
            alert("הייתה בעיה בהעלאת הקובץ או בעדכון הסטטוס");
        }
    };




    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                p: { xs: 1, sm: 2, md: 3 }
            }}
        >
            <Paper>


                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    {/* טאבים בצד שמאל */}
                    <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                        <Tab label={`לא שולם (${filteredByStatus.unpaid.length})`} />
                        <Tab label={`בהמתנה (${filteredByStatus.pending.length})`} />
                        <Tab label={`שולם (${filteredByStatus.paid.length})`} />
                    </Tabs>

                    {/* כפתור יצוא XL בצד ימין */}
                    <IconButton
                        onClick={exportToExcel}
                        sx={{
                            padding: 0,
                            width: 30,
                            height: 30,
                        }}
                    >
                        <img
                            src={xl}
                            alt="xl"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </IconButton>
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
                                {tab === 2 && <TableCell>שולם בתאריך</TableCell>}
                                {tab === 2 && <TableCell>אמצעי תשלום</TableCell>}


                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        טוען...
                                    </TableCell>
                                </TableRow>
                            ) : paymentsToShow.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        {tab === 0 && "אין תשלומים שלא שולמו"}
                                        {tab === 1 && "אין תשלומים בהמתנה"}
                                        {tab === 2 && "אין תשלומים ששולמו"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paymentsToShow.map((payment) => (
                                    <TableRow key={payment._id}>

                                        {user?.role === "admin" && (
                                            <TableCell>
                                                <IconButton
                                                    onClick={() => handleOpen(payment)}
                                                    disabled={payment.status !== "unpaid"}
                                                >
                                                    <EditIcon color={payment.status === "unpaid" ? "warning" : "disabled"} />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(payment._id)}>
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </TableCell>
                                        )}

                                        {user?.role === "admin" && (
                                            <TableCell>{payment.userId?.fullName}</TableCell>
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
                                            {payment.status === "paid" && <CheckCircleIcon color="success" />}
                                            {payment.status === "pending" && user?.role !== "admin" && <HourglassEmptyIcon color="warning" />}
                                            {payment.status === "unpaid" && user?.role === "admin" && <CancelIcon color="error" />}

                                            {(user?.role !== "admin" && payment.status === "unpaid") && (
                                                <Box>
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        style={{ display: "none" }}
                                                        onChange={(e) => handleFileChange(e, payment._id)}
                                                    />
                                                    <Tooltip title="העלה קובץ אישור תשלום">
                                                        <IconButton onClick={handleClick}>
                                                            <UploadFileIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            )}

                                            {(user?.role === "admin" && payment.status === "pending") && (
                                                <Box>
                                                    <FilePreview filePath={payment.filePath} />
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<CheckIcon />}
                                                        onClick={async () => {
                                                            const confirmChange = window.confirm("האם אתה בטוח שהתשלום הועבר?");
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
                                                            textTransform: "none",
                                                            fontSize: 12,
                                                            borderRadius: 2,
                                                            paddingX: 1.5,
                                                            paddingY: 0.5,
                                                            backgroundColor: "rgba(0, 128, 0, 0.05)",
                                                            color: "green",
                                                            "&:hover": { backgroundColor: "rgba(0, 128, 0, 0.1)" },
                                                        }}
                                                    >
                                                        אישור
                                                    </Button>
                                                </Box>
                                            )}
                                        </TableCell>

                                     

                                        {tab === 2 && (
                                            <TableCell>
                                                {payment.paymentDate
                                                    ? new Date(payment.paymentDate).toLocaleDateString("he-IL", { day: "2-digit", month: "long", year: "numeric" })
                                                    : ""}
                                            </TableCell>
                                        )}
                                        {tab === 2 && <TableCell>{payment.paymentMethod}</TableCell>}

                                    </TableRow>
                                ))
                            )}
                        </TableBody>


                    </Table>
                </TableContainer>
            </Paper ></Box>
    );
}
