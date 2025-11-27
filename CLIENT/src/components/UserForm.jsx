// src/components/UserForm.jsx
import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Box, MenuItem, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import { checkEmailExists } from "../features/users/UserSlice";

export default function UserForm({
    mode = "create",
    initialData = {},
    isAdmin = false,
    onSubmit,
    onClose,
    allTenants = [],
    activeTenants = []
}) {
    // const dispatch = useDispatch();
    // const emailExists = useSelector(state => state.users.emailExists);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        apartmentNumber: "",
        password: "654321",
        role: "tenant",
        ...initialData
    });

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        phone: "",
        apartmentNumber: ""
    });

    const originalData = initialData;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));

        if (name === "apartmentNumber") {
            if (value < 0) {
                setErrors(prev => ({ ...prev, apartmentNumber: "מספר דירה לא יכול להיות קטן מ-0" }));
                return;
            }
            else {
                setErrors(prev => ({ ...prev, apartmentNumber: "" }));
            }
        }
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const isValidEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    };

    const isValidPhone = (phone) => {
        const pattern = /^[0-9]{9,15}$/;
        return pattern.test(phone);
    };


    const validate = () => {
        let newErrors = { fullName: "", email: "", phone: "", apartmentNumber: "" };
        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = "שם מלא חובה";
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = "אימייל חובה";
            isValid = false;
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = "פורמט אימייל לא תקין";
            isValid = false;
        } else {
            const theEmail = formData.email;

            const conflict = allTenants.some(
                (t) =>
                    t.email === theEmail &&
                    t._id !== initialData._id
            );

            if (conflict) {
                newErrors.email = "כבר קיים דייר עם מייל זה";
                isValid = false;
            }
            // try {
            //     if (formData.email) {
            //         const result = dispatch(checkEmailExists({
            //             email: formData.email,
            //             id: initialData._id || null
            //         }));

            //         const exists = result.payload?.exists;

            //         if (exists) {
            //             newErrors.email += (newErrors.email ? " | " : "") + "מייל כבר קיים במערכת";
            //             isValid = false;
            //         }
            //     }
            // } catch (err) {
            //     console.error(err);
            // }
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "טלפון חובה";
            isValid = false;
        } else if (!isValidPhone(formData.phone)) {
            newErrors.phone = "מספר טלפון לא תקין";
            isValid = false;
        }

        if (isAdmin && formData.role === "tenant") {
            if (!formData.apartmentNumber || formData.apartmentNumber < 0) {
                newErrors.apartmentNumber = "מספר דירה חובה וללא ערך שלילי";
                isValid = false;
            }
        }

        if (isAdmin && formData.role === "tenant") {
            const apartmentNumber = Number(formData.apartmentNumber);

            const conflict = activeTenants.some(
                (t) =>
                    t.apartmentNumber === apartmentNumber &&
                    t._id !== initialData._id
            );

            if (conflict) {
                newErrors.apartmentNumber = "דייר פעיל כבר קיים עם מספר דירה זה";
                isValid = false;
            }
        }

        setErrors(newErrors);

        return isValid;

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        onSubmit(formData);
    };

    const handleSecondary = () => {
        if (mode === "create") {
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                apartmentNumber: "",
                password: "654321",
                role: "tenant",
            });
        } else {
            setFormData({ ...originalData });
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, pt: 5, position: "relative" }}
        >

            <IconButton
                onClick={onClose} sx={{ position: "absolute", top: 0, right: 0 }}>
                <CloseIcon />
            </IconButton>

            <TextField
                label="שם מלא"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
            />

            <TextField
                label="אימייל"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={Boolean(errors.email)}
                helperText={errors.email}
            />

            <TextField
                label="טלפון"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                error={Boolean(errors.phone)}
                helperText={errors.phone}
            />

            {!isAdmin && (
                <TextField
                    label="סיסמה"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            )}

            {isAdmin && (
                <TextField
                    label="מספר דירה"
                    name="apartmentNumber"
                    type="number"
                    value={formData.apartmentNumber || ""}
                    onChange={handleChange}
                    required={formData.role === "tenant"}
                    inputProps={{ min: 0 }}
                    error={Boolean(errors.apartmentNumber)}
                    helperText={errors.apartmentNumber}
                />
            )}

            {isAdmin && (
                <TextField select label="תפקיד" name="role" value={formData.role} onChange={handleChange}>
                    <MenuItem value="tenant">דייר</MenuItem>
                    <MenuItem value="admin">מנהל</MenuItem>
                </TextField>
            )}

            <Button variant="contained" type="submit">
                {mode === "create" ? "יצירת דייר" : "שמירת שינויים"}
            </Button>

            <Button
                variant="outlined" color="secondary"
                onClick={handleSecondary}
            >
                {mode === "create" ? "רוקן שדות" : "בטל שינויים"}
            </Button>
        </Box>
    );
}
