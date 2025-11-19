// src/features/notices/noticesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

// --- שליפת כל המודעות ---
export const fetchNotices = createAsyncThunk(
  "notices/fetchNotices",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/notices/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

// --- יצירת מודעה ---
export const createNotice = createAsyncThunk(
  "notices/createNotice",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/notices", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

// --- עדכון מודעה ---
export const updateNotice = createAsyncThunk(
  "notices/updateNotice",
  async ({ id, data }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/notices/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

// --- מחיקת מודעה ---
export const deleteNotice = createAsyncThunk(
  "notices/deleteNotice",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Error");
    }
  }
);

// --- Slice ---
const noticesSlice = createSlice({
  name: "notices",
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // --- fetchNotices ---
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- createNotice ---
      .addCase(createNotice.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // --- updateNotice ---
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.list = state.list.map(n =>
          n._id === action.payload._id ? action.payload : n
        );
      })

      // --- deleteNotice ---
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.list = state.list.filter(n => n._id !== action.payload);
      });
  }
});

export default noticesSlice.reducer;
