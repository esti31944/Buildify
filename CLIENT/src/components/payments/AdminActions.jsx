// components/payments/AdminActions.jsx
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AdminActions({ handleOpen }) {
    return (
        <Box display="flex" justifyContent="flex-start" gap={2}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
            >
                תשלום חדש
            </Button>

            
        </Box>
    );
}
