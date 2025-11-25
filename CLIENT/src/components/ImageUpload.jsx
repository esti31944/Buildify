import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { Box, Typography, Button, Paper, Stack, CircularProgress } from "@mui/material";
import axios from "axios";

const ImageUpload = forwardRef(({ onUploadComplete }, ref) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getFile: () => file,
    }));

    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setLoading(true);

        const formData = new FormData();
        formData.append("file", selected);

        try {
            const res = await axios.post("http://localhost:3001/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });


            if (onUploadComplete) {
                onUploadComplete(`/uploads/${res.data.image.filename}`);
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("שגיאה בהעלאת הקובץ");
        } finally {
            setLoading(false);
        }
    };

    const handleChooseFile = () => {
        fileInputRef.current.click();
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 2, width: "100%", maxWidth: 500 }}>
            <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#1f2937" }}>העלאת תמונה</Typography>

                <Button variant="outlined" onClick={handleChooseFile}>
                    {file ? file.name : "בחר קובץ"}
                </Button>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />

                {loading && <CircularProgress size={24} />}

                {preview && !loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                        <img src={preview} alt="preview" style={{ width: 200, borderRadius: 12 }} />
                    </Box>
                )}
            </Stack>
        </Paper>
    );
});

export default ImageUpload;
