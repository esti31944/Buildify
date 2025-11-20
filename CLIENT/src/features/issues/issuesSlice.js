// src/features/issues/issuesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

export const fetchAllIssues = createAsyncThunk("issues/fetchAllIssues", async () => {
  const res = await axios.get("/issues/list");
  return res.data;
});

export const fetchMyIssues = createAsyncThunk("issues/fetchMyIssues", async () => {
  const res = await axios.get("/issues/myIssues");
  return res.data;
});

export const createIssue = createAsyncThunk("issues/createIssue", async (newIssue) => {
  const res = await axios.post("/issues", newIssue);
  return res.data;
});

export const updateIssue = createAsyncThunk(
  "issues/updateIssue",
  async ({ id, data }) => {
    const res = await axios.put(`/issues/update/${id}`, data);
    return res.data.issue;
  }
);

export const updateIssueStatus = createAsyncThunk("issues/updateIssueStatus", async (id) => {
  const res = await axios.put(`/issues/updateStatus/${id}`);
  return res.data.issue;
}
);

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
      .addCase(fetchMyIssues.pending, (state) => { state.loading = true; })
      .addCase(fetchMyIssues.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchMyIssues.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(createIssue.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(fetchAllIssues.pending, (state) => { state.loading = true; })
      .addCase(fetchAllIssues.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchAllIssues.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(updateIssue.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const idx = state.list.findIndex((i) => i._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((i) => i._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      });
  },
});

export default issuesSlice.reducer;
