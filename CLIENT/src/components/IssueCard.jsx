import React from "react";
import { Card, CardContent, CardMedia, Box, Typography, Chip, Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { updateIssueStatus } from "../features/issues/issuesSlice";
import "../styles/IssueCard.css"

export default function IssueCard({ _id, title, description, imageUrl, createdAt, userId, reporterName, status, onEdit }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const statusMap = {
    new: { label: "חדשה", class: "badge open" },
    in_progress: { label: "בטיפול", class: "badge progress" },
    fixed: { label: "טופלה", class: "badge fixed" },
  };

  const { label, class: statusClass } =
    statusMap[status] || { label: status, class: "badge" };

  const nextStatusLabel = {
    new: "החלף ל'בטיפול'",
    in_progress: "החלף ל'תוקן'",
  };

  const handleStatusChange = () => {
    dispatch(updateIssueStatus(_id));
  };

  const canEdit = user?.role === "tenant" && user?._id?.toString() === userId?._id?.toString() && status === "new";

  const reporterText = user?.role === "admin"
    ? `דווח ע"י ${reporterName || "משתמש לא ידוע"}`
    : null;

  const dateStr = new Date(createdAt).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, });
  const formattedDate = user?.role === "admin"
    ? `ב-${dateStr}`
    : `דווח ב-${dateStr}`;

  return (
    <Card sx={{ display: "flex", flexDirection: "row-reverse", borderRadius: 3, boxShadow: 3, overflow: "hidden", mb: 2, height: 180, }}>
      <CardMedia
        component="img"
        image={imageUrl && imageUrl !== ""
          ? imageUrl.startsWith("http")
            ? imageUrl
            : `http://localhost:3001${imageUrl}`
          : "https://images.pexels.com/photos/28216688/pexels-photo-28216688/free-photo-of-autumn-camping.png?auto=compress&cs=tinysrgb&w=600"
        }
        alt={title}
        sx={{ width: 180, objectFit: "cover", bgcolor: "#eee", }}
      />

      <Box sx={{ display: "flex", flexDirection: "column", p: 2, flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 600 }}>
            {title}
          </Typography>

          <span className={statusClass}>{label}</span>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "#444", mb: 1 }}
        >
          {description?.length > 80 ? description.slice(0, 80) + "..." : description}
        </Typography>

        <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ mt: "auto", display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "0.65rem", color: "#777" }}>
              {reporterText}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "#777" }}>
              {formattedDate}
            </Typography>
          </Box>

          {user?.role === "admin" && status !== "fixed" && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleStatusChange}
              sx={{ fontSize: "0.75rem" }}
            >
              {nextStatusLabel[status]}
            </Button>
          )}

          {canEdit && (
            <IconButton
              onClick={() => onEdit({ _id, title, description, imageUrl })}
              sx={{ bgcolor: "#f5f5f5", borderRadius: "12px", width: 36, height: 36, "&:hover": { bgcolor: "#e0e0e0" } }}
            >
              <EditIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Card>
  );
}