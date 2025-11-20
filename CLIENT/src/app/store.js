import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import issuesReducer from "../features/issues/issuesSlice";
import paymentsReducer from "../features/Payments/Paymentslice";
import usersReducer from "../features/user/UserSlice";
import roomsReducer from "../features/room/RoomSlice"; 
import noticesReducer from "../features/notice/NoticeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
    payments: paymentsReducer,
    users: usersReducer,
    rooms: roomsReducer, 
    notices: noticesReducer,
  },
});
