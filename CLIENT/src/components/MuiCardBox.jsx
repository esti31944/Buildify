
import { Card, Box, Typography, IconButton, Chip } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

export default function MuiCardBox({
  icon,
  title,
  subtitle,
  color = "#F1F5F9",
  link,
  count,
  children,
  variant = "default",
}) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={
        variant === "top" && link ? () => navigate(link) : undefined
      }
      sx={{
        p: variant === "top" ? 1.8 : 2,
        borderRadius: "14px",
        transition: "0.2s",
        minHeight: variant === "top" ? "110px" : "125px",
        minWidth: variant === "top" ? "100%" : "300px",
        background: variant === "top" ? "#fff" : "#fff",
        boxShadow: variant === "top"
          ? "0 1px 5px rgba(0,0,0,0.05)"
          : "0 2px 6px rgba(0,0,0,0.05)",
        cursor:
          variant === "top" && link
            ? "pointer"
            : "default",
        "&:hover": variant === "top" && link ? {
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        } : {},
      }}
    >
      {/* כותרת + אייקון + תג כמות + אייקון ניווט */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          {/* אייקון רקע מעוגל */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "12px",
              background: color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "22px",
            }}
          >
            {icon}
          </Box>

          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        </Box>

        {/* תג כמות אם יש */}
        <Box display="flex" alignItems="center" gap={1}>
          {count !== undefined && (
            <Chip
              label={count}
              size="small"
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          )}

          {/* לחצן מעבר בלבד */}
          {variant !== "top" && link && (
            <IconButton
              onClick={() => navigate(link)}
              sx={{
                background: "#F1F5F9",
                borderRadius: "10px",
                ml: 1,
                "&:hover": { background: "#E2E8F0" },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* תת כותרת */}
      {
        subtitle && (
          <Typography sx={{ mt: 1, fontSize: "0.9rem", color: "text.secondary" }}>
            {subtitle}
          </Typography>
        )
      }

      {/* תוכן */}
      {children && <Box mt={2}>{children}</Box>}
    </Card >

  );
}
