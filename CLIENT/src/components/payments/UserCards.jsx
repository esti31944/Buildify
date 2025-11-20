// components/payments/UserCards.jsx
import { Grid, Paper, Typography } from "@mui/material";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function UserCards({ payments, unpaidCount, monthlyData, setDisplayedPayments }) {
    // ממיין את הנתונים לפי תאריך (month הוא Date)
    const sortedMonthlyData = [...monthlyData].sort(
        (a, b) => new Date(a.month) - new Date(b.month)
    );

    return (
        <Grid container spacing={2} mt={1} mb={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                    sx={{
                        p: 3, borderRadius: 3, boxShadow: 4,
                        backgroundColor: "rgba(169, 211, 245, 0.8)",
                        textAlign: "center", height: 200,
                        display: "flex", flexDirection: "column", justifyContent: "center",
                    }}
                >
                    <Typography variant="h3">💳</Typography>
                    <Typography variant="h5" fontWeight="bold">
                        ₪{payments.reduce((s, p) => s + (p.amount || 0), 0).toFixed(2)}
                    </Typography>
                    <Typography>סה"כ תשלומים: {payments.length}</Typography>
                </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                    sx={{
                        p: 3, borderRadius: 3, boxShadow: 4,
                        backgroundColor: "rgba(255, 180, 180, 0.8)",
                        textAlign: "center", 
                        height: 200, display: "flex",
                        flexDirection: "column", justifyContent: "center",
                    }}
                >
                    <Typography variant="h3">❌</Typography>
                    <Typography variant="h5" fontWeight="bold">{unpaidCount}</Typography>
                    <Typography>תשלומים שלא שולמו</Typography>
                </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 4,
                        backgroundColor: "rgba(144, 238, 144, 0.8)",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: 200,
                        minHeight: 200,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1 }}> גרף תשלומים </Typography>

                    <ResponsiveContainer width="100%" height="100%" minHeight={150}>
                        <LineChart data={sortedMonthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                 tick={false}
                            />
                            <YAxis />
                            <Tooltip
                                labelFormatter={(label) =>
                                    new Date(label).toLocaleDateString("he-IL", {
                                        month: "long",
                                        year: "numeric",
                                    })
                                }
                            />
                            <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>

                </Paper>
            </Grid>
        </Grid>
    );
}
