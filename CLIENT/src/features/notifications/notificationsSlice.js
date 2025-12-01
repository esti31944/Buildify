import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

// --- THUNKS --- //

// הבאת כל ההתראות של המשתמש
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const res = await axios.get("/notifications/my");
    return res.data;
  }
);

// סימון התראה כנקראה
export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id) => {
    const { data } = await axios.put(`/notifications/read/${id}`);
    return data;
  }
);

// סימון כל ההתראות כנקראו
// export const markAllAsRead = createAsyncThunk(
//   "notifications/markAllAsRead",
//   async () => {
//     const res = await axios.patch("/notifications/readAll");
//     return res.data;
//   }
// );

// --- SLICE --- //

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  clearNotifications: (state) => {
    state.list = [];
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // MARK AS READ
      .addCase(markAsRead.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((n) => n._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      })

      // MARK ALL AS READ
      //   .addCase(markAllAsRead.fulfilled, (state) => {
      //     state.list = state.list.map((n) => ({ ...n, isRead: true }));
      //   })
      ;
  },
});

export default notificationsSlice.reducer;

export const selectUnreadCount = (state) =>
  state.notifications.list.filter(n => !n.isRead).length;

export const { clearNotifications } = notificationsSlice.actions;
