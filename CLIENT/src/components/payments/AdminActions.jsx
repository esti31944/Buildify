import { Box, Button, Tooltip,IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AdminActions({ handleOpen }) {
    return (
      <Box display="flex" justifyContent="flex-end">
        <Tooltip title="הוספת תשלום">
          <IconButton
            variant="outlined"
            onClick={() => handleOpen()}
            sx={{ display: "flex", alignItems: "center", gap: 1, borderRadius: 3, borderColor: "#1976d2 !important", color: "#16acec", backgroundColor: "rgba(25, 118, 210, 0.05)", "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" } }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
}
