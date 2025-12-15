import React from "react";
import { useSelector } from "react-redux";
import { Box, Paper, Typography } from "@mui/material";

export default function Header() {
  const user = useSelector((state) => state.auth.user);

  return (
    <Paper
      elevation={4}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1200,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        mb: 2,
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(255,255,255,0.95)",
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 0.5, color: "#000" }}
        >
          {user?.role === "admin" ? "לוח ניהול - מנהל ועד" : "לוח דייר"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#888" }}>
          {new Date().toLocaleDateString("he-IL")}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Typography variant="body1" sx={{ fontWeight: 500, color: "#555" }}>
          {user?.fullName}
        </Typography>
      </Box>
    </Paper>
  );
}
