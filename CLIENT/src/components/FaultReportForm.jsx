import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIssue, updateIssue, fetchAllIssues, fetchMyIssues } from '../features/issues/issuesSlice';
import ImageUpload from "./ImageUpload";
import '../styles/FaultReportForm.css';

export default function FaultReportForm({ onClose, initialData = null, mode = "create" }) {
    const imageUploadRef = useRef(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    // Form state כולל כבר את imageUrl שמתקבל מ־ImageUpload
    const [formData, setFormData] = useState(initialData || { title: '', description: '', imageUrl: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // פונקציה שמקבלת את הנתיב שהשרת החזיר אחרי העלאה
    const handleImageUploadComplete = (url) => {
            console.log("התמונה הועלתה, הנתיב:", url);

        setFormData(prev => ({ ...prev, imageUrl: url }));
    };


    const validateForm = (data) => {
        if (!data.title.trim() || data.title.length < 2 || data.title.length > 200) {
            return 'כותרת התקלה חייבת להיות בין 2 ל-200 תווים';
        }
        if (!data.description.trim() || data.description.length < 1 || data.description.length > 1000) {
            return 'תיאור התקלה חייב להיות בין 1 ל-1000 תווים';
        }
        if (data.imageUrl && !/^https?:\/\/\S+$/.test(data.imageUrl)) {
            return 'כתובת התמונה אינה חוקית';
        }
        return null;
    };

    const handleSubmit = async () => {
        setError('');
        const errorMsg = validateForm(formData);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        try {
            if (mode === "create") {
                await dispatch(createIssue(formData)).unwrap();
            } else {
                const { _id, ...dataToUpdate } = formData;
                await dispatch(updateIssue({ id: initialData._id, data: dataToUpdate })).unwrap();
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        setFormData({ title: '', description: '', imageUrl: '' });
    };

    return (
        <div className="fault-report-container">
            <div className="fault-report-card">
                <div className="fault-report-header">
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

                        {/* קומפוננטת העלאת תמונה שמחזירה את הנתיב ל־formData */}
                        <ImageUpload ref={imageUploadRef} onUploadComplete={handleImageUploadComplete} />

                        <div className="fault-report-buttons">
                            <button onClick={handleSubmit} className="fault-report-submit-btn">
                                {mode === "create" ? "שלח דיווח" : "שמור שינויים"}
                            </button>
                            <button onClick={handleCancel} className="fault-report-cancel-btn">
                                רוקן שדות
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
