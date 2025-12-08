import { Box, Typography } from "@mui/material";

export default function TabLabel({ title, count }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <span>{title}</span>
            {count > 0 && (
                <Typography sx={{ ml: 0.5, mr: 0.5, fontSize: 12, color: "text.secondary" }}>
                   ( {count})
                </Typography>
            )}
        </Box>
    );
}
