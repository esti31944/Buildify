// components/payments/AdminActions.jsx
import { Box, Button, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AdminActions({ handleOpen }) {
    return (
      <Box display="flex" justifyContent="flex-start" gap={2}>
            <Tooltip title="הוספת תשלום" arrow>
                <Button
                    variant="contained"
                    color= "#94b6d9ff"
                    onClick={() => handleOpen()}
                    sx={{
                        minWidth: 0, 
                        width: 40,
                        height: 40,
                        padding: 0,
                        borderRadius: "50%", 
                    }}

        >
                <AddIcon />
            </Button>
        </Tooltip>
    </Box >
    );
}
