import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createIssue } from '../features/issues/issuesSlice';
import '../styles/FaultReportForm.css';

export default function FaultReportForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!formData.title.trim() || !formData.description.trim()) {
            setError('אנא מלא את כל השדות המסומנים בכוכבית');
            return;
        }
        setError('');
        setSubmitted(true);
        try {
            // await dispatch(createIssue({ ...formData, userId: user._id })).unwrap();
            // await dispatch(createIssue({ ...formData, userId: "690c7ef1d8ff598025ee6983" })).unwrap();
            await dispatch(createIssue({ ...formData})).unwrap();
            setSubmitted(true);
        } catch (err) {
            setError('שגיאה בשליחת הדיווח, נסה שוב');
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
        setFormData({ title: '', description: '', imageUrl: '' });
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
                    <h1 className="fault-report-title">דיווח תקלה חדשה</h1>
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

                        <div className="fault-report-field">
                            <label className="fault-report-label">
                                כתובת לתמונה <span className="fault-report-optional">(אופציונלי)</span>
                            </label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="fault-report-input"
                                placeholder="לא נבחר כרגע"
                            />
                        </div>

                        <div className="fault-report-buttons">
                            <button onClick={handleSubmit} className="fault-report-submit-btn">
                                שלח דיווח
                            </button>
                            <button onClick={handleCancel}
                                className="fault-report-cancel-btn"
                            >
                                ביטול
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="fault-report-footer">
                <p>הדיווח ישלח לטיפול הצוות הרלוונטי</p>
            </div>
        </div>
    );
}