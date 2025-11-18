import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../features/Payments/Paymentslice";
import { fetchAllUsers } from "../features/User/UserSlice"; // הנחה שיש Slice כזה

export default function PaymentsManager() {
  const dispatch = useDispatch();
  const { list: payments, loading } = useSelector((state) => state.payments);
  const { list: users } = useSelector((state) => state.users); // רשימת משתמשים

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    month: "",
    amount: "",
    status: "unpaid",
    paymentMethod: "bank",
    userId: "",
  });

  useEffect(() => {
    dispatch(fetchAllPayments());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleOpen = (payment = null) => {
    if (payment) {
      setEditMode(true);
      setForm({
        title: payment.title,
        month: payment.month,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        userId: payment.userId,
        _id: payment._id,
      });
    } else {
      setEditMode(false);
      setForm({
        title: "",
        month: "",
        amount: "",
        status: "unpaid",
        paymentMethod: "bank",
        userId: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (editMode) {
      dispatch(updatePayment({ id: form._id, data: form }));
    } else {
      console.log("hiii form", form);
      dispatch(createPayment(form));
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deletePayment(id));
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.title?.includes(search) ||
      p.month?.includes(search) ||
      p.amount?.toString().includes(search)
  );

  return (
    <Box p={3} display="flex" flexDirection="column" gap={3}>
      {/* Header Buttons */}
      <Box display="flex" justifyContent="flex-start" gap={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          תשלום חדש
        </Button>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
          הוסף לכולם
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ backgroundColor: "#ffeaea", borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <CreditCardIcon sx={{ fontSize: 40, color: "#e28a8a" }} />
            <Box textAlign="right">
              <Typography fontSize={14}>תשלומים ממתינים</Typography>
              <Typography fontSize={32} fontWeight={700} color="#d32f2f">
                ₪
                {payments
                  .filter((p) => p.status !== "paid")
                  .reduce((s, p) => s + p.amount, 0)
                  .toFixed(2)}
              </Typography>
              <Typography fontSize={14}>
                {payments.filter((p) => p.status !== "paid").length} תשלומים
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search + Table */}
      <Paper sx={{ p: 2, borderRadius: 3 }}>
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

        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">פעולות</TableCell>
              <TableCell align="right">סטטוס</TableCell>
              <TableCell align="right">סכום</TableCell>
              <TableCell align="right">חודש</TableCell>
              <TableCell align="right">כותרת</TableCell>
              <TableCell align="right">משתמש</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  טוען...
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  לא נמצאו תשלומים
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((p) => (
                <TableRow key={p._id}>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(p)}>
                      <EditIcon color="warning" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">{p.status}</TableCell>
                  <TableCell align="right">₪{p.amount}</TableCell>
                  <TableCell align="right">{p.month}</TableCell>
                  <TableCell align="right">{p.title}</TableCell>
                  <TableCell align="right">
                    {users.find((u) => u._id === p.userId)?.fullName || "לא ידוע"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog - יצירה/עריכה */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? "עריכת תשלום" : "תשלום חדש"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="כותרת"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <TextField
            label="חודש"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
          />

          <TextField
            label="סכום"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <TextField
            label="סטטוס"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          />

          <TextField
            label="אמצעי תשלום"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
          />

          {/* Select User */}
          <FormControl fullWidth>
            <InputLabel id="user-select-label">משתמש</InputLabel>
            <Select
              labelId="user-select-label"
              value={form.userId}
              label="משתמש"
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button variant="contained" onClick={handleSubmit}>
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
