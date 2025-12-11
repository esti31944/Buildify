import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Grid, Typography, Chip, CircularProgress, IconButton, Divider } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import AccessTimeIcon from "@mui/icons-material/AccessTime";

import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

import MuiCardBox from "../../components/MuiCardBox";
import TopCardBox from "../../components/dashboard/TopCardBox"
import BottomCardBox from "../../components/dashboard/BottomCardBox"
import { fetchMyPayments } from "../../features/Payments/Paymentslice"
import { fetchMyIssues } from "../../features/issues/issuesSlice"
import { fetchMyReservations } from "../../features/reservations/reservationsSlice"
import { fetchNotices } from "../../features/notice/NoticeSlice"
import { fetchNotifications } from "../../features/notifications/notificationsSlice"

export default function TenantDashboard() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const payments = useSelector((state) => state.payments.list);
  const issues = useSelector((state) => state.issues.list);
  const reservations = useSelector((state) => state.reservations.list);
  const notices = useSelector((state) => state.notices.list);
  const notifications = useSelector((state) => state.notifications.list);

  useEffect(() => {
    dispatch(fetchMyPayments());
    dispatch(fetchMyIssues());
    dispatch(fetchMyReservations());
    dispatch(fetchNotices());
    dispatch(fetchNotifications());
  }, [dispatch]);

  const LoadingOr = (condition, content) =>
    condition ? (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    ) : (
      content
    );

  const pluralize = (count, single, plural) => {
    if (count === 0) return null;
    if (count === 1) return `${single} ${count}`;
    return `${count} ${plural}`;
  };

  const validPayments = payments?.filter((payment) => payment.status === "unpaid");
  const sumToPay = validPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const openIssuesCount = issues?.filter((issue) => issue.status !== "fixed").length;

  const now = new Date();

  const validReservations = reservations?.filter((reserve) => {
    const end = new Date(`${reserve.date}T${reserve.timeSlot.to}:00`)
    return end > now;
  })

  const reservationsCount = validReservations.length;

  const todayReservationsCount = validReservations.filter(res => {
    const resDate = new Date(res.date).toDateString();
    return resDate === now.toDateString();
  }).length;

  const isTodayReservation = (date) =>
    new Date(date).toDateString() === new Date().toDateString();

  const validNotices = notices?.filter((notice) => {
    return notice.expiresAt && new Date(notice.expiresAt) > now;
  });
  const noticesCount = validNotices.length;
  const eventsCount = validNotices.filter((notice) => notice.category === "event").length;
  const announcementsCount = validNotices.filter((notice) => notice.category === "announcement").length;
  const line1 =
    noticesCount === 0
      ? "אין מודעות"
      : pluralize(noticesCount, "מודעה", "מודעות");
  const announcementsText = pluralize(announcementsCount, "הודעה", "הודעות");
  const eventsText = pluralize(eventsCount, "אירוע", "אירועים");
  const line2 = [announcementsText, eventsText].filter(Boolean).join(" · ");
  const noticesSubtitleText = `${line1}${line2 ? `\n${line2}` : ""}`;


  const getStatusText = (type, value) => {
    const map = {
      issue: {
        new: { label: "חדש", color: "rgb(255, 148, 81)" },
        in_progress: { label: "בטיפול", color: "rgb(81, 73, 234)" },
        fixed: { label: "טופל", color: "rgb(76, 174, 147)" },
      },
      payment: {
        unpaid: { label: "טרם שולם", color: "rgb(255, 148, 81)" },
        pending: { label: "בהמתנה", color: "rgb(81, 73, 234)" },
        paid: { label: "שולם", color: "rgb(76, 174, 147)" },
      },
    };

    return map[type][value];
  };

  const typeLabelsNotifications = {
    payment: "תשלום",
    issue: "תקלה",
    notice: "הודעה",
    room: "חדר",
    system: "מערכת",
  };

  const typeIconsNotifications = {
    payment: <PaymentIcon sx={{ fontSize: 15, ml: 1 }} />,
    issue: <ErrorOutlineOutlinedIcon sx={{ fontSize: 15, ml: 1 }} />,
    notice: <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 15, ml: 1 }} />,
    room: <MeetingRoomOutlinedIcon sx={{ fontSize: 15, ml: 1 }} />,
    system: <WarningAmberOutlinedIcon sx={{ fontSize: 15, ml: 1 }} />,
  };


  return (

    // <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
    <Box p={2}>

      {/* כותרת */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        שלום, {user?.fullName || ""}!
      </Typography>

      {/* הכרטיסים העליונים: מובייל: 12 (1 בשורה), טאבלט: 6 (2 בשורה), מסך גדול: 3 (4 בשורה) */}
      {/* הכרטיסים העליונים */}
      <Grid container spacing={2} justifyContent="center">
      {/* <Grid item xs={12} sm={6} md={6} lg={3} sx={{ display: "flex" }}> */}
        <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <TopCardBox
            icon={<PaymentIcon />}
            color="#0097A7"
            title="התשלומים שלי"
            link="/payments"
            subtitle={
              sumToPay !== 0
                ? `סך הכל לתשלום: ${sumToPay} ₪`
                : "אין חוב"
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <TopCardBox
            icon={<ErrorOutlineOutlinedIcon />}
            color="#388e3c"
            title="דווח על תקלה"
            link="/issues"
            subtitle={
              openIssuesCount !== 0
                ? pluralize(openIssuesCount, "תקלה פתוחה", "תקלות פתוחות")
                : "אין תקלות פתוחות"
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <TopCardBox
            icon={<MeetingRoomOutlinedIcon />}
            color="#fbc02d"
            title="הזמן חדר"
            link="/documents"
            subtitle={
              reservationsCount !== 0
                ? `${pluralize(reservationsCount, "הזמנה קרובה", "הזמנות קרובות")}\n${todayReservationsCount ? `${todayReservationsCount} להיום` : ""}`
                : "אין הזמנות"
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <TopCardBox
            icon={<ChatBubbleOutlineOutlinedIcon />}
            color="#fb8c00"
            title="לוח מודעות"
            link="/notices"
            subtitle={noticesSubtitleText}
          />
        </Grid>
      </Grid>

      {/* רשימות תחתונות */}

      {/* <Grid container spacing={2} justifyContent="center" sx={{ mt: 2,  backgroundColor: "#ffffff",borderRadius: 4,p: 3,boxShadow: "0 2px 10px rgba(0,0,0,0.15)"}}> */}
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>

        {/* תשלומים */}
        {/* <Grid item xs={12} md={6} lg={6} sx={{ display: "flex", order: { xs: 1, md: 1 } }}> */}
        
        {/* <Grid item xs={12} md={6} sx={{ display: "flex", order: { xs: 1, md: 1 } }}> */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <BottomCardBox
            title="תשלומים אחרונים"
            icon={<PaymentIcon />}
            link="/payments"
          >
            {payments.slice(0, 2).map(pay => (
              <Box
                key={pay._id}
                sx={{
                  background: "#f9fafb",
                  p: 1.5,
                  mb: 1,
                  borderRadius: "12px",
                }}
              >

                <Typography sx={{ fontWeight: 600, mt: 1 }}>
                  {pay.title}
                </Typography>

                <Typography color="text.secondary" fontSize="0.85rem" sx={{ display: "flex", gap: 0.5 }}>
                  {pay.amount} ₪
                  <span>•</span>
                  <Typography color={getStatusText("payment", pay.status).color} fontSize="0.85rem">
                    {getStatusText("payment", pay.status).label}
                  </Typography>
                </Typography>

              </Box>
            ))}
          </BottomCardBox>
        </Grid>

        {/* תקלות */}
        {/* <Grid item xs={12} md={6} sx={{ display: "flex", order: { xs: 2, md: 2 } }}> */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <BottomCardBox
            title="תקלות אחרונות"
            icon={<ErrorOutlineOutlinedIcon />}
            link="/issues"
          >
            {issues.slice(0, 2).map(issue => (
              <Box
                key={issue._id}
                sx={{
                  background: "#f9fafb",
                  p: 1.5,
                  mb: 1,
                  borderRadius: "12px",
                }}
              >

                <Typography sx={{ fontWeight: 600, mt: 1 }}>
                  {issue.title}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>

                  <Box sx={{ display: "flex", gap: 0.5, }}>
                    <Typography color="text.secondary" fontSize="0.75rem">
                      {"דווח בתאריך"}
                    </Typography>
                    <Typography color="text.secondary" fontSize="0.85rem">
                      {`${new Date(issue.createdAt).toLocaleDateString("he-IL")}`}
                    </Typography>
                  </Box>

                  <Typography color={getStatusText("issue", issue.status).color} fontSize="0.85rem">
                    {getStatusText("issue", issue.status).label}
                  </Typography>

                </Box>

              </Box>
            ))}
          </BottomCardBox>
        </Grid>

        {/* שורה שנייה (מסך גדול/טאבלט): מודעות (6/12), הזמנות (6/12) */}
        {/* מובייל: הזמנות 12 (סדר 3), מודעות 12 (סדר 4) */}
        {/* הזמנות */}
        {/* <Grid item xs={12} md={6} sx={{ display: "flex", order: { xs: 3, md: 4 } }}> */}
        <Grid item xs={12} md={6} sx={{ display: "flex"}}>
          <BottomCardBox
            title="הזמנות אחרונות"
            icon={<MeetingRoomOutlinedIcon />}
            link="/documents"
          >
            {validReservations.slice(0, 2).map(order => (
              <Box
                key={order._id}
                sx={{
                  background: "#f9fafb",
                  p: 1.5,
                  mb: 1,
                  borderRadius: "12px",
                }}
              >

                <Typography sx={{ fontWeight: 600, mt: 1 }}>
                  {order.roomId?.name}
                </Typography>

                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: "1rem" }} />
                  {new Date(order.date).toLocaleDateString("he-IL")}
                  {" • "}
                  {order.timeSlot?.to} - {order.timeSlot?.from}

                  {isTodayReservation(order.date) && (
                    <Chip
                      label="היום"
                      size="small"
                      sx={{
                        ml: 1, fontSize: "0.7rem", height: "20px",
                        borderRadius:"6px", backgroundColor: "#E0F7FA", color: "#007C91", border: "1px solid #B2EBF2",
                      }}
                    />
                  )}

                </Typography>
              </Box>
            ))}
          </BottomCardBox>
        </Grid>

        {/* מודעות */}
        {/* <Grid item xs={12} md={6} sx={{ display: "flex", order: { xs: 4, md: 3 } }}> */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <BottomCardBox
            title="מודעות אחרונות"
            icon={<ChatBubbleOutlineOutlinedIcon />}
            link="/notices"
          >
            {notices.slice(0, 2).map(notice => (
              <Box
                key={notice._id}
                sx={{
                  background: "#f9fafb",
                  p: 1.5,
                  mb: 1,
                  borderRadius: "12px",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {notice.title}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, }}>
                  <Typography color="text.secondary" fontSize="0.75rem">
                    {"פורסם בתאריך"}
                  </Typography>
                  <Typography color="text.secondary" fontSize="0.85rem">
                    {`${new Date(notice.createdAt).toLocaleDateString("he-IL")}`}
                  </Typography>
                </Box>

              </Box>
            ))}
          </BottomCardBox>
        </Grid>

        {/* שורה שלישית (מלאה): התראות. מובייל: התראות 12 (סדר 5) */}
        {/* התראות */}
        {/* <Grid item xs={12} md={12} lg={12} sx={{ display: "flex", order: { xs: 5, md: 5 } }}> */}
        <Grid item xs={12} sx={{ display: "flex" }}>
          <BottomCardBox
            title="התראות אחרונות"
            icon={<NotificationsNoneOutlinedIcon />}
            link="/notifications">
            {notifications.slice(0, 2).map(n => (
              <Box
                key={n._id}
                sx={{
                  background: "#f9fafb",
                  p: 1.5,
                  mb: 1,
                  borderRadius: "12px",
                }}
              >

                <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {typeIconsNotifications[n.type]}
                  <Typography sx={{ fontWeight: 600 }}>{typeLabelsNotifications[n.type]}</Typography>
                </Typography>

                <Typography sx={{ fontSize: 12 }}>{n.message}</Typography>

                <Box mt={2}>
                  <Divider sx={{ width: "70%", borderColor: "#d9d6d6ff" }} />
                  <Box sx={{ display: "flex", gap: 0.5, }}>
                    <Typography color="text.secondary" fontSize="0.75rem">
                      {"התקבלה בתאריך"}
                    </Typography>
                    <Typography color="text.secondary" fontSize="0.85rem">
                      {`${new Date(n.createdAt).toLocaleDateString("he-IL")}`}
                    </Typography>
                  </Box>
                </Box>

              </Box>
            ))}
          </BottomCardBox>
        </Grid>

      </Grid>
    </Box>
  );
}
