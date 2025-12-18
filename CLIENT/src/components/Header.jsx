import React from "react";
import { useSelector } from "react-redux";
import { Box, Paper, Typography, Avatar } from "@mui/material";
import Logo from "../assets/logo_remove.png";

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
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", md: "center" },
        gap: { xs: 2, md: 0 },
        p: { xs: 2, sm: 2.5, md: 3 },
        mb: 2,
        borderRadius: 3,
        background: "linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(0, 151, 167, 0.03) 100%)",
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        boxShadow: "0 4px 20px rgba(25, 118, 210, 0.08)",
        border: "1px solid rgba(25, 118, 210, 0.08)",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              height: { xs: 45, sm: 50, md: 55 },
              width: "auto",
              filter: "drop-shadow(0 2px 8px rgba(0, 151, 167, 0.15))",
            }}
          />
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              borderRight: "2px solid",
              borderImage: "linear-gradient(to bottom, #1976d2, #0097A7) 1",
              pr: 2,
              height: 50,
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.35rem", md: "1.5rem" },
              background: "linear-gradient(135deg, #1976d2 0%, #0097A7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 0.3,
            }}
          >
            {user?.role === "admin" ? "לוח ניהול - מנהל ועד" : "לוח דייר"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#0097A7",
                display: "inline-block",
              }}
            />
            {new Date().toLocaleDateString("he-IL", {
              weekday: { xs: "short", sm: "long" }[
                window.innerWidth < 600 ? "xs" : "sm"
              ],
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>
      </Box>

      {/* User Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "space-between", md: "flex-start" },
          gap: 2,
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.2, sm: 1.5 },
          borderRadius: 2,
          background: "linear-gradient(135deg, rgba(25, 118, 210, 0.06) 0%, rgba(0, 151, 167, 0.06) 100%)",
          border: "1px solid rgba(25, 118, 210, 0.12)",
        }}
      >
        <Box sx={{ textAlign: "right", flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              fontWeight: 500,
              mb: 0.3,
            }}
          >
            {user?.role === "admin" ? "מנהל מערכת" : "דייר"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: "#333",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
            }}
          >
            {user?.fullName}
          </Typography>
        </Box>
        <Avatar
          sx={{
            width: { xs: 38, sm: 42, md: 44 },
            height: { xs: 38, sm: 42, md: 44 },
            background: "linear-gradient(135deg, #1976d2 0%, #0097A7 100%)",
            fontWeight: 600,
            fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
            boxShadow: "0 2px 12px rgba(25, 118, 210, 0.25)",
          }}
        >
          {user?.fullName?.charAt(0) || "D"}
        </Avatar>
      </Box>
    </Paper>
  );
}