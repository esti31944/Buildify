import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIssue, updateIssue, fetchAllIssues, fetchMyIssues, uploadIssueImage } from '../features/issues/issuesSlice';
import { fetchNotifications } from '../features/notifications/notificationsSlice';
import '../styles/FaultReportForm.css';
import {
    Box, TextField, IconButton, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, TableContainer, Paper, Button, Tooltip
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function FaultReportForm({ onClose, initialData = null, mode = "create" }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [formData, setFormData] = useState(
        initialData || { title: '', description: '', imageUrl: '' });

    const [previewImage, setPreviewImage] = useState(null);
    const [uploadedNow, setUploadedNow] = useState(false);

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData && initialData.imageUrl) {
            setPreviewImage(initialData.imageUrl);
        }
    }, [initialData]);

    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);


    const validateForm = (formData) => {
        if (!formData.title.trim() || formData.title.length < 2 || formData.title.length > 200) {
            return 'כותרת התקלה חייבת להיות בין 2 ל-200 תווים';
        }
        if (!formData.description.trim() || formData.description.length < 1 || formData.description.length > 1000) {
            return 'תיאור התקלה חייב להיות בין 1 ל-1000 תווים';
        }
        // if (formData.imageUrl && !/^https?:\/\/\S+$/.test(formData.imageUrl)) {
        //     return 'כתובת התמונה אינה חוקית';
        // }
        return null;
    }

    const handleSubmit = async () => {
        setError('');

        if (!formData.title.trim() || !formData.description.trim()) {
            setError('אנא מלא את כל השדות המסומנים בכוכבית');
            return;
        }

        const errorMsg = validateForm(formData);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        try {
            if (mode === "create") {

                const newIssue = { title: formData.title, description: formData.description, userId: user._id };
                const issue = await dispatch(createIssue(newIssue)).unwrap();

                if (fileInputRef.current.files[0]) {
                    await dispatch(uploadIssueImage({
                        issueId: issue._id,
                        file: fileInputRef.current.files[0]
                    })).unwrap();
                }

                await dispatch(fetchNotifications());

            } else {
                const dataToUpdate = {
                    title: formData.title,
                    description: formData.description,
                    // imageUrl: formData.imageUrl || "" 
                };

                const issueId = formData._id || initialData?._id;

                let updatedIssue = await dispatch(updateIssue({
                    id: issueId,
                    data: dataToUpdate
                })).unwrap();

                // העלאת קובץ – אם נבחר
                if (fileInputRef.current?.files[0]) {
                    updatedIssue = await dispatch(uploadIssueImage({
                        issueId: updatedIssue._id,
                        file: fileInputRef.current.files[0]
                    })).unwrap();
                }
            }
            if (user.role === "admin") {
                dispatch(fetchAllIssues());
            } else {
                dispatch(fetchMyIssues());
            }
            onClose();

        } catch (err) {
            setError("שגיאה בשליחה");
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCancel = () => {
        if (mode === "edit" || mode === "update") {
            setFormData(initialData || { title: '', description: '', imageUrl: '' });
            setPreviewImage(initialData?.imageUrl || null);
            setUploadedNow(false);
        }
        else {
            setFormData({ title: '', description: '', imageUrl: '' });
            setPreviewImage(null);
            setUploadedNow(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // תצוגה מקדימה
        const localUrl = URL.createObjectURL(file);
        setPreviewImage(localUrl);

        // מסמן שהמשתמש העלה עכשיו תמונה
        setUploadedNow(true);

        // שומרים את הקובץ עצמו (לשליחה לשרת)
        setFormData((prev) => ({
            ...prev,
            imageFile: file,
            imageUrl: "uploaded" // מסמן שיש תמונה, לא מציג כתובת
        }));
    };

    const handleRemoveImage = () => {
        // ביטול תצוגה
        setPreviewImage(null);

        // מחיקת נתוני תמונה בטופס
        setFormData(prev => ({
            ...prev,
            imageUrl: "",
            imageFile: null
        }));

        // ניקוי האינפוט (מאוד חשוב!)
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }

        setUploadedNow(false);
    };

    const fileInputRef = useRef(null);
    const handleSelectFile = () => {
        fileInputRef.current.click(); // פותח את חלון הבחירה
    };

    return (
        <div className="fault-report-container">
            <div className="fault-report-card">
                <div className="fault-report-header">
                    <div className="fault-report-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 2H15V4H9V2Z" />
                            <path d="M7 4H17C18.1 4 19 4.9 19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6C5 4.9 5.9 4 7 4Z" />
                            <line x1="9" y1="10" x2="15" y2="10" />
                            <line x1="9" y1="14" x2="15" y2="14" />
                        </svg>
                    </div>
                    <h1 className="fault-report-title">
                        {mode === "create" ? "דיווח תקלה חדשה" : "עריכת תקלה"}
                    </h1>
                </div>

                {submitted ? (
                    <div className="fault-report-success">
                        <div className="fault-report-success-title">הדיווח נשלח בהצלחה!</div>
                        <p className="fault-report-success-text">נחזור אליך בהקדם</p>
                    </div>
                ) : (
                    <div className="fault-report-form">
                        {error && <div className="fault-report-error">{error}</div>}
                        <div className="fault-report-field">
                            <label className="fault-report-label">
                                כותרת התקלה <span className="fault-report-required">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="fault-report-input"
                                placeholder="הזן את כותרת התקלה"
                            />
                        </div>

                        <div className="fault-report-field">
                            <label className="fault-report-label">
                                תיאור תקלה <span className="fault-report-required">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="fault-report-textarea"
                                placeholder="תאר את התקלה בפירוט..."
                            />
                        </div>

                        <Box>
                            <input
                                type="file"
                                name="imageUrl"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                            />
                            <Tooltip title="העלה תמונה">
                                <IconButton onClick={handleSelectFile}>
                                    <UploadFileIcon />
                                </IconButton>
                            </Tooltip>
                            {uploadedNow && (
                                <Typography sx={{ fontSize: 14, mt: 1 }}>✔ תמונה הועלתה בהצלחה</Typography>
                            )}
                            {previewImage && (
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: 180,
                                        height: 180,
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        bgcolor: "#eee",
                                        mb: 2,
                                    }}
                                >
                                    {!initialData?.imageUrl && (
                                        <IconButton
                                            size="small"
                                            onClick={handleRemoveImage}
                                            sx={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", color: "white", "&:hover": { background: "rgba(0,0,0,0.7)" }, zIndex: 2 }}
                                        >
                                            ✕
                                        </IconButton>
                                    )}
                                    <img
                                        src={
                                            previewImage.startsWith("blob:")
                                                ? previewImage
                                                : previewImage.startsWith("http")
                                                    ? previewImage
                                                    // : `http://localhost:3001${previewImage}`
                                                    : `${import.meta.env.VITE_API_URL}${previewImage}`
                                        }
                                        alt="תצוגה מקדימה"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </Box>
                            )}

                        </Box>

                        <div className="fault-report-buttons">
                            <button onClick={handleSubmit} className="fault-report-submit-btn">
                                {mode === "create" ? "שלח דיווח" : "שמור שינויים"}
                            </button>
                            <button onClick={handleCancel}
                                className="fault-report-cancel-btn"
                            >
                                {mode === "create" ? "רוקן שדות" : "בטל שינויים"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}