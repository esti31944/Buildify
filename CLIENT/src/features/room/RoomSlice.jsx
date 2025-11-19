// src/features/rooms/roomsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

// --- THUNKS --- //

// טעינת כל החדרים
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/rooms/list");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// יצירת חדר
export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (roomData, thunkAPI) => {
    try {
      const res = await axios.post("/rooms", roomData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// עדכון חדר
export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ id, updatedFields }, thunkAPI) => {
    try {
      const res = await axios.put(`/rooms/${id}`, updatedFields);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// מחיקת חדר
export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/rooms/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- SLICE --- //
const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH ROOMS
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createRoom.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updateRoom.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((r) => r._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      })

      // DELETE
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r._id !== action.payload);
      });
  },
});

export default roomsSlice.reducer;
