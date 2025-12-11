import React from "react";
import { Card, Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TopCardBox({
    icon,
    title,
    subtitle,
    color = "#F1F5F9",
    link,
    count,
}) {
    const navigate = useNavigate();

    return (
        <Card
            onClick={link ? () => navigate(link) : undefined}
            sx={{
                width: "100%",
                minWidth: 270,
                minHeight: "130px",
                p: 1.8,
                border: "1px solid hsl(0 0% 89.8%)",
                borderRadius: "14px",
                transition: "0.2s",
                // minHeight: "130px",
                // minWidth: "250px",
                // width: "100%",
                background: "#fff",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                cursor: link ? "pointer" : "default",
                "&:hover": link
                    ? { boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }
                    : {},
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* אייקון + כותרת */}
                <Box display="flex" gap={1}>
                    <Box
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "12px",
                            background: color + "33",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "22px",
                        }}
                    >
                        {React.cloneElement(icon, { style: { color, fontSize: 20 } })}
                    </Box>

                    <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
                </Box>

                {/* תג כמות (אם יש) */}
                {/* {count !== undefined && (
                    <Chip label={count} size="small" sx={{ fontWeight: 600 }} />
                )} */}
            </Box>

            {/* תת כותרת */}
            {subtitle && (
                <Typography sx={{ mt: 1, fontSize: "0.9rem", color: "text.secondary", whiteSpace: "pre-line" }}>
                    {subtitle}
                </Typography>
            )}
        </Card>
    );
}
