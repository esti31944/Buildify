import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import issuesReducer from "../features/issues/issuesSlice";
import paymentsReducer from "../features/Payments/Paymentslice";
import usersReducer from "../features/users/UserSlice"
import roomsReducer from "../features/room/RoomSlice"; 
import reservationsReducer from "../features/reservations/reservationsSlice";
import noticesReducer from "../features/notice/NoticeSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
    payments: paymentsReducer,
    users: usersReducer,
    rooms: roomsReducer, 
    reservations: reservationsReducer,
    notices: noticesReducer,
    notifications: notificationsReducer,
  },
});
