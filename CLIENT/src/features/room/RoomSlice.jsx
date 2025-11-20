import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// טעינת חדרים מהשרת
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/rooms/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("בעיה בטעינת חדרים");
      const data = await res.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// הוספת חדר חדש
export const addRoom = createAsyncThunk(
  "rooms/addRoom",
  async (formData, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("שגיאה בשמירת חדר");
      const saved = await res.json();
      return saved;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// עדכון חדר קיים
export const updateRoom = createAsyncThunk(
  "rooms/updateRoom",
  async ({ id, formData }, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("שגיאה בעדכון חדר");
      const saved = await res.json();
      return saved;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// מחיקת חדר
export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (id, thunkAPI) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3001/rooms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("שגיאה במחיקת חדר");
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchRooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addRoom
      .addCase(addRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.error = action.payload;
      })

      // updateRoom
      .addCase(updateRoom.fulfilled, (state, action) => {
        const index = state.rooms.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.error = action.payload;
      })

      // deleteRoom
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default roomsSlice.reducer;
