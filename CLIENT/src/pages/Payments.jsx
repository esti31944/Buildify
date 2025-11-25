import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllPayments,
    fetchMyPayments,
    createPayment,
    updatePayment,
    deletePayment,
} from "../features/Payments/Paymentslice";
import { fetchAllUsers } from "../features/users/UserSlice";

import UserCards from "../components/payments/UserCards";
import PaymentsTable from "../components/payments/PaymentsTable";
import PaymentForm from "../components/payments/PaymentForm";
import AdminActions from "../components/payments/AdminActions";
import dayjs from "dayjs";

import { Box, Typography } from "@mui/material";

export default function PaymentsNEW() {
    const dispatch = useDispatch();

    const { list: payments, loading } = useSelector((state) => state.payments);
    const { list: users } = useSelector((state) => state.users);
    const user = useSelector((state) => state.auth.user);

    // טבלה
    const [search, setSearch] = useState("");
    const [displayedPayments, setDisplayedPayments] = useState([]);

    // טופס
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        title: "",
        month: "",
        amount: "",
        userId: "",
        fullName: "",
    });


// --- פתיחת טופס עריכה / חדש --- //
const handleOpen = (payment = null) => {
    if (payment) {
        setEditMode(true);
        setForm({
            _id: payment._id,
            title: payment.title || "",
            amount: payment.amount || "",
            month: payment.month ? dayjs(payment.month).startOf("month") : null,
            userId: payment.userId?._id || payment.userId || "",
            fullName: payment.userId?.fullName || ""
        });
    } else {
        setEditMode(false);
        setForm({
            _id: null,
            title: "",
            amount: "",
            month: null,
            userId: "",
            fullName: ""
        });
    }
    setOpen(true);
};

// --- שמירה (יצירה / עדכון) --- //
const handleSubmit = () => {
    const { title, amount, month, userId, _id } = form;

    // המרת month ל-Date תקין, amount למספר, userId רק אם קיים
    const payload = {
        title,
        amount: Number(amount),
        month: month ? dayjs(month).startOf("month").toDate() : null,
    };
console.log("Payload being sent:", payload, "Edit mode:", editMode, "ID:", form._id);

if (!editMode && userId) payload.userId = userId;

    console.log("Submitting payload:", payload, "Edit mode:", editMode, "ID:", _id);

if (editMode) {
    dispatch(updatePayment({ id: form._id, updatedData: payload }))
        .then(() => dispatch(fetchAllPayments()));
} else {
    dispatch(createPayment(payload))
        .then(() => dispatch(fetchAllPayments()));
}



    handleClose();
};

      const handleClose = () => {
        setOpen(false);
        setForm({ title: "", month: "", amount: "", userId: "", fullName: "" });
    };


    // מחיקה
    const handleDelete = (id) => {
        dispatch(deletePayment(id)).then(() => {
            dispatch(fetchAllPayments());
        });
    };

    // טען נתונים
    useEffect(() => {
        if (user?.role === "admin") {
            dispatch(fetchAllPayments());
            dispatch(fetchAllUsers());
        } else {
            dispatch(fetchMyPayments());
        }
    }, [dispatch, user]);


    // שמירת תשלומים להצגה
    useEffect(() => {
        setDisplayedPayments(payments);
    }, [payments]);

    // סינון לפי חיפוש
    const filteredPayments = displayedPayments.filter(
        (p) =>
            p.title?.includes(search) ||
            p.month?.includes(search) ||
            p.amount?.toString().includes(search)
    );

    // חישוב גרף
    const monthlyData = Object.values(
        payments.reduce((acc, p) => {
            if (!acc[p.month]) acc[p.month] = { month: p.month, amount: 0 };
            acc[p.month].amount += p.amount || 0;
            return acc;
        }, {})
    );

    const unpaidCount = payments.filter((p) => p.status === "unpaid").length;

    return (
        <Box p={2}>
            <Typography variant="h4" fontWeight="bold" mb={2}>
                ניהול תשלומים
            </Typography>

            {/* כרטיסים רק לדיירים */}
            {user?.role !== "admin" && (
                <UserCards
                    payments={payments}
                    unpaidCount={unpaidCount}
                    monthlyData={monthlyData}
                    setDisplayedPayments={setDisplayedPayments}
                />
            )}

            {/* כפתורי מנהל */}
            {user?.role === "admin" && (
                <AdminActions handleOpen={handleOpen} />
            )}

            {/* טבלה */}
            <PaymentsTable
                search={search}
                setSearch={setSearch}
                filteredPayments={filteredPayments}
                loading={loading}
                user={user}
                handleOpen={handleOpen}
                handleDelete={handleDelete}
            />

            {/* טופס */}
            <PaymentForm
                open={open}
                onClose={handleClose}
                onSubmit={handleSubmit}
                form={form}
                setForm={setForm}
                editMode={editMode}
                users={users}
            />
        </Box>
    );
}
