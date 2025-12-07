// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: "#16acec",
        },
        secondary: {
            main: "#16acec",
        },
    },
    typography: {
        fontFamily: "'Assistant', sans-serif, Arial",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: "rgba(22, 172, 236, 0.25)",
                    "&:hover": {
                        backgroundColor: "rgba(22, 172, 236, 0.35)",
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    fontFamily: "'Assistant', sans-serif, Arial",
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontFamily: "'Assistant', sans-serif, Arial",
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    fontFamily: "'Assistant', sans-serif, Arial",
                },
            },
        },
    },
});

export default theme;
