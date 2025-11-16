// src/features/issues/issuesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

// export const fetchAllIssues = createAsyncThunk("issues/fetchAllIssues", async () => {
//   const res = await axios.get("/issues/list");
//   return res.data;
// });
export const fetchAllIssues = createAsyncThunk("issues/fetchAllIssues", async (_, { getState }) => {
  const { user } = getState().auth;
  // const res = await axios.get("/issues/list", {
  //   headers: {
  //     Authorization: `Bearer ${user.token}`,
  //   },
  // });
  const res = await axios.get("/issues/list", {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTBjNzkzNDZjZmFiYzU4OGNkNzEzYTgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjMyODg2NDAsImV4cCI6MTc2MzM3NTA0MH0.uGBPHo9zERO7LPT9iWu6dacOEhU9yPtYkdsPC8jeamU`,
    },
  });
  return res.data;
});

// export const fetchMyIssues = createAsyncThunk("issues/fetchMyIssues", async (userId) => {
//   const res = await axios.get(`/issues/myIssues?userId=${userId}`);
//   return res.data;
// });
export const fetchMyIssues = createAsyncThunk("issues/fetchMyIssues", async (_, { getState }) => {
  const { user } = getState().auth;
  // const res = await axios.get("/issues/myIssues", {
  //   headers: {
  //     Authorization: `Bearer ${user.token}`, // שולח את ה-token
  //   },
  // });
  // const res = await axios.get("/issues/myIssues", {
  //   headers: {
  //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTBiYjEyOTE1MDAyN2I3MmRhNTg5MWEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2MzI4Njk5MiwiZXhwIjoxNzYzMzczMzkyfQ.3sgUrSkwsH-mm9k9FGtMIRlq4gsLeDV5Mefays1ENQ4`,
  //   },
  // });
  const res = await axios.get("/issues/myIssues", {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTEwNjc4MmMxY2M1OGNjM2YyOGRiNWUiLCJyb2xlIjoidGVuYW50IiwiaWF0IjoxNzYzMjkwNDY4LCJleHAiOjE3NjMzNzY4Njh9.tD6g3UR_kMcDSpaoB-Gj-DpgBM2un1aaTBc9Aw5I6SU`,
    },
  });
  return res.data;
});

// export const createIssue = createAsyncThunk("issues/createIssue", async (newIssue) => {
//   const res = await axios.post("/issues", newIssue);
//   return res.data;
// });
export const createIssue = createAsyncThunk("issues/createIssue", async (newIssue, { getState }) => {
  const { user } = getState().auth;
  // const res = await axios.post("/issues", newIssue, {
  //   headers: {
  //     Authorization: `Bearer ${user.token}`,
  //   },
  // });
  const res = await axios.post("/issues", newIssue, {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTEwNjc4MmMxY2M1OGNjM2YyOGRiNWUiLCJyb2xlIjoidGVuYW50IiwiaWF0IjoxNzYzMjkwNDY4LCJleHAiOjE3NjMzNzY4Njh9.tD6g3UR_kMcDSpaoB-Gj-DpgBM2un1aaTBc9Aw5I6SU`,
    },
  });
  return res.data;
});

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
      })
      .addCase(fetchAllIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((i) => i._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      });
  },
});

export default issuesSlice.reducer;
