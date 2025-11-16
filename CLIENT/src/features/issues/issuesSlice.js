// src/features/issues/issuesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const fetchMyIssues = createAsyncThunk("issues/fetchMyIssues", async (userId) => {
  const res = await axios.get(`/issues/myIssues?userId=${userId}`);
  return res.data;
});

export const createIssue = createAsyncThunk("issues/createIssue", async (newIssue) => {
  const res = await axios.post("/issues", newIssue);
  return res.data;
});

const issuesSlice = createSlice({
  name: "issues",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export default issuesSlice.reducer;
