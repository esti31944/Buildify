import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    IconButton,
    Box,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function PaymentForm({ open, onClose, onSubmit, form, setForm, editMode, users }) {
    const [selectOpen, setSelectOpen] = useState(false);

    const handleUserChange = (e) => {
        const value = e.target.value;
        if (value.includes("all")) {
            if (form.userId.length === users.length) {
                setForm({ ...form, userId: [] });
            } else {
                setForm({ ...form, userId: users.map((u) => u._id) });
            }
        } else {
            setForm({ ...form, userId: value });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth sx={{ direction: "rtl" }}>
            <Box className="fault-report-card" sx={{ p: 2 }}>
                <div className="fault-report-header" style={{ marginBottom: 12 }}>
                    <div className="fault-report-icon-wrapper">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                    </div>

                    <h1 className="fault-report-title" style={{ fontSize: 22 }}>
                        {editMode ? "עריכת תשלום" : "תשלום חדש"}
                    </h1>
                </div>

                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div className="fault-report-field">
                        <label className="fault-report-label">כותרת</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="fault-report-input"
                            placeholder="הזן כותרת"
                        />
                    </div>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="fault-report-field">
                            <label className="fault-report-label">חודש ושנה</label>
                            <DatePicker
                                views={["year", "month"]}
                                value={form.month ? dayjs(form.month) : null}
                                onChange={(newValue) => {
                                    setForm({ ...form, month: newValue ? newValue.format("YYYY-MM") : "" });
                                }}
                                slotProps={{ textField: { className: "fault-report-input" } }}
                            />
                        </div>
                    </LocalizationProvider>

                    <div className="fault-report-field">
                        <label className="fault-report-label">סכום</label>
                        <input
                            type="number"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            className="fault-report-input"
                            placeholder="הזן סכום"
                        />
                    </div>

                    <div className="fault-report-field">
                        <label className="fault-report-label">משתמשים</label>
                        <FormControl fullWidth>
                            <Select
                                multiple
                                value={Array.isArray(form.userId) ? form.userId : []}
                                onChange={handleUserChange}
                                open={selectOpen}
                                onOpen={() => setSelectOpen(true)}
                                onClose={() => setSelectOpen(false)}
                                renderValue={(selected) => {
                                    const selectedNames = users
                                        .filter((u) => selected.includes(u._id))
                                        .map((u) => u.fullName)
                                        .join(", ");
                                    return selectedNames;
                                }}
                                className="fault-report-input"
                            >
                                <MenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectOpen(false);
                                    }}
                                    sx={{ display: "flex", justifyContent: "flex-end", borderBottom: "1px solid #ddd" }}
                                >
                                    <IconButton size="small">
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </MenuItem>

                                <MenuItem value="all" style={{ fontWeight: "bold", borderBottom: "1px solid #ccc" }}>
                                    כל המשתמשים
                                </MenuItem>

                                {users?.map((u) => (
                                    <MenuItem key={u._id} value={u._id}>
                                        {u.fullName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "space-between", px: 2 }}>
                    <button onClick={onClose} className="fault-report-cancel-btn">
                        ביטול
                    </button>
                    <button onClick={onSubmit} className="fault-report-submit-btn">
                        שמור
                    </button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
