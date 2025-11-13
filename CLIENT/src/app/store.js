import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import issuesReducer from "../features/issues/issuesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
  },
});
