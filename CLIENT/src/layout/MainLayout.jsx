import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { IconButton, Box } from "@mui/material";
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';

export default function MainLayout() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // זיהוי מסך קטן
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 900) {
        setIsMobile(true);
        setOpenSidebar(false);
      } else {
        setIsMobile(false);
        setOpenSidebar(true);
      }
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <div className="app-shell" style={{ position: "relative" }}>
      {/* אייקון פתיחה - רק במובייל */}
      {isMobile && !openSidebar && (
        <IconButton
          onClick={() => setOpenSidebar(true)}
          sx={{ position: "fixed", top: 20, right: 20, zIndex: 3000 ,
          backgroundColor: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(6px)",
          boxShadow: 2,
          borderRadius: 2,
          padding: "10px 14px",
        }}
        >
          <SpaceDashboardOutlinedIcon fontSize="large" />
        </IconButton>
      )}

      {/* BACKDROP — רק במובייל כשהתפריט פתוח */}
      {isMobile && openSidebar && (
        <Box
          onClick={() => setOpenSidebar(false)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.25)",
            zIndex: 1990,
          }}
        />
      )}

      {/* SIDEBAR */}
      {openSidebar && (
        <Sidebar
          isMobile={isMobile}
          onClose={() => setOpenSidebar(false)}
        />
      )}
      <div className="content-area">
        <Header />
        <main style={{ marginTop: 12 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
