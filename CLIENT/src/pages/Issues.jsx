//pages>Issues.jsx
import React, { useState, useEffect } from "react";
import IssueCard from "../components/IssueCard";
import FaultReportForm from "../components/FaultReportForm"
import { useSelector, useDispatch } from "react-redux";
import { fetchMyIssues, fetchAllIssues } from "../features/issues/issuesSlice";
import { Box, Button, Tabs, Tab, Typography, Modal, Stack, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function Issues() {
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector((state) => state.issues);
    const user = useSelector((state) => state.auth.user);

    const [showForm, setShowForm] = useState(false);
    const [editIssue, setEditIssue] = useState(null);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (!user) return;

        if (user.role === "admin") {
            dispatch(fetchAllIssues());
        } else {
            dispatch(fetchMyIssues());
        }
    }, [dispatch, user]);

    if (loading) return <p>טוען...</p>;
    if (error) return <p>שגיאה: {error}</p>;

    const filtered = {
        new: list.filter((i) => i.status === "new"),
        in_progress: list.filter((i) => i.status === "in_progress"),
        fixed: list.filter((i) => i.status === "fixed"),
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                תקלות בבניין
            </Typography>

            {user?.role !== "admin" && (
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    sx={{ mb: 2 }}
                    onClick={() => {
                        setEditIssue(null);
                        setShowForm(true);
                    }}
                >
                    דווח על תקלה
                </Button>
            )}

            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label={`חדשות (${filtered.new.length})`} />
                <Tab label={`בטיפול (${filtered.in_progress.length})`} />
                <Tab label={`טופלו (${filtered.fixed.length})`} />
            </Tabs>

            <Stack spacing={2}>
                {(tab === 0 ? filtered.new :
                    tab === 1 ? filtered.in_progress : filtered.fixed
                ).map((item) => (
                    <IssueCard
                        key={item._id} {...item}
                        reporterName={item.userId.fullName}
                        onEdit={(data) => {
                            setEditIssue(data);
                            setShowForm(true);
                        }}
                    />
                ))}

                {(tab === 0 && filtered.new.length === 0) && <p>אין תקלות חדשות</p>}
                {(tab === 1 && filtered.in_progress.length === 0) && <p>אין תקלות בטיפול</p>}
                {(tab === 2 && filtered.fixed.length === 0) && <p>אין תקלות שטופלו</p>}
            </Stack>

            <Modal open={showForm} onClose={() => setShowForm(false)}>
                <Box
                    sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: 550, bgcolor: "white", p: 3, borderRadius: 3, boxShadow: 6, maxHeight: "95vh", overflowY: "auto" }}
                >
                    <Button
                        onClick={() => setShowForm(false)}
                        sx={{ position: "absolute", top: 8, left: 8, minWidth: "unset", padding: "4px", fontSize: "20px", lineHeight: "1", }}
                    >
                        ✕
                    </Button>

                    <FaultReportForm
                        onClose={() =>setShowForm(false)}
                        initialData={editIssue}
                        mode={editIssue ? "edit" : "create"}
                    />
                </Box>
            </Modal>

        </Box>
    );
}