import React from "react";
import { Card, Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import { useNavigate } from "react-router-dom";

export default function BottomCardBox({
    icon,
    title,
    link,
    children,
    linkText = "הכל"
}) {
    const navigate = useNavigate();

    const isEmpty =
        !children ||
        (Array.isArray(children) && children.length === 0);

    return (
        <Card
            sx={{
                p: 2,
                border: "1px solid hsl(0 0% 89.8%)",
                borderRadius: "14px",
                minHeight: "125px",
                width: "100%",
                width: "300px",
                background: "#fff",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
        >
            {/* כותרת + אייקון + ניווט */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {React.cloneElement(icon, {
                            sx: {
                                fontSize: 20, color: "#1e293b",
                                filter: "drop-shadow(0 0 0.4px #16acec)",
                            }
                        })}

                    </Box>

                    <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
                </Box>

                {link && (
                    <Box
                        onClick={() => navigate(link)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            minHeight: "30px",
                            px: 1,
                            py: "4px",
                            color: "#16acec",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: 500,
                            transition: "background-color 0.25s ease",
                            "&:hover": { backgroundColor: "#f5f5f5", },
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", color: "#1e293b", fontWeight: 500 }}>
                            {linkText}
                        </Typography>

                        <ArrowBackIosNewIcon sx={{ fontSize: "13px", color: "#1e293b", filter: "drop-shadow(0 0 0.5px #16acec)", }} />
                    </Box>
                )}
            </Box>

            <Box sx={{
                borderBottom: "1px solid hsl(0 0% 89.8%)",
                width: "100%",
                height: "6%",
                mt: 1.5,
                mb: 1.5,
            }}
            />
            {/* תוכן פנימי */}
            <Box>{isEmpty ? (
                <Typography
                    sx={{
                        textAlign: "center",
                        color: "#7a7a7a",
                        fontSize: "0.95rem",
                        padding: "12px 0",
                    }}
                >
                    אין {title.split(" ")[0]} להצגה
                </Typography>
            ) : (
                children
            )}</Box>
        </Card>
    );
}
