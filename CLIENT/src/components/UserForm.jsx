// src/components/UserForm.jsx
import React, { useState, useEffect } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";

export default function UserForm({
    mode = "create",           // "create" | "edit"
    initialData = {},          // נתוני דייר כשעורכים
    isAdmin = false,           // מי משתמש? מנהל או דייר
    onSubmit,                  // פונקציה שמחזירה את הדאטה למעלה
}) {

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
        apartmentNumber: ""
    });


    // ------------------------------
    // שינוי שדה מטופס
    // ------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "apartmentNumber") {
            if (value < 0) {
                setErrors(prev => ({ ...prev, apartmentNumber: "מספר דירה לא יכול להיות קטן מ-0" }));
                return;
            }
            else{
                setErrors(prev => ({ ...prev, apartmentNumber: "" }));
            }
        }
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // ------------------------------
    // ולידציה בסיסית
    // ------------------------------
    const validate = () => {
        if (!formData.fullName.trim()) return "שם מלא חובה";
        if (!formData.email.trim()) return "אימייל חובה";
        if (!formData.phone.trim()) return "טלפון חובה";
        if (formData.role === "tenant") {
            if (!formData.apartmentNumber || formData.apartmentNumber < 0) return "מספר דירה חובה וללא ערך שלילי";
        }
        return null;
    };

    //-----------------------------------
    // שליחת הטופס
    //-----------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        const err = validate();
        if (err) {
            alert(err);
            return;
        }
        onSubmit(formData);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
        >
            <TextField
                label="שם מלא"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
            />

            <TextField
                label="אימייל"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />

            <TextField
                label="טלפון"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
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
        </Box>
    );
}
