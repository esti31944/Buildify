// קודם צריך להתקין אם עוד לא מותקן:
// npm install @mui/x-date-pickers @mui/x-date-pickers/AdapterDayjs dayjs

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Button } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function PaymentForm({ open, onClose, onSubmit, form, setForm, editMode, users }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{editMode ? "עריכת תשלום" : "תשלום חדש"}</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="כותרת"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        views={['year', 'month']}
                        label="חודש ושנה"
                        value={form.month ? dayjs(form.month) : null}
                        onChange={(newValue) => {
                            setForm({ ...form, month: newValue ? newValue.format('YYYY-MM') : '' });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                <TextField
                    label="סכום"
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />

                <FormControl fullWidth>
                    <InputLabel id="user-select-label">משתמש</InputLabel>
                    <Select
                        labelId="user-select-label"
                        value={form.userId}
                        label="משתמש"
                        onChange={(e) => setForm({ ...form, userId: e.target.value })}
                    >
                        {users?.map((u) => (
                            <MenuItem key={u._id} value={u._id}>
                                {u.fullName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>ביטול</Button>
                <Button variant="contained" onClick={onSubmit}>
                    שמור
                </Button>
            </DialogActions>
        </Dialog>
    );
}
