import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import issuesReducer from "../features/issues/issuesSlice";
import paymentsReducer from "../features/Payments/Paymentslice";
import usersReducer from "../features/users/UserSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
    payments: paymentsReducer,
    users: usersReducer,
  },
});
