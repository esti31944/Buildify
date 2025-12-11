// src/features/reservations/reservationsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

/* --------------------  THUNKS  -------------------- */

// GET /reservations/list
export const fetchReservations = createAsyncThunk(
    "reservations/fetchReservations",
    async (params = {}) => {
        const res = await axios.get("/reservations/list", { params });
        return res.data;
    }
);

// GET /reservations/:id
export const fetchReservationById = createAsyncThunk(
    "reservations/fetchReservationById",
    async (id) => {
        const res = await axios.get(`/reservations/${id}`);
        return res.data;
    }
);

export const fetchMyReservations = createAsyncThunk(
    "reservations/fetchMyReservations",
    async () => {
        const res = await axios.get("/reservations/myReservations");
        return res.data;
    }
);

// POST /reservations
export const createReservation = createAsyncThunk(
    "reservations/createReservation",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post("/reservations", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// DELETE /reservations/:id
export const deleteReservation = createAsyncThunk(
    "reservations/deleteReservation",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/reservations/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// PUT /reservations/:id (כרגע מחזיר Not implemented אבל עדיין תומך)
export const updateReservation = createAsyncThunk(
    "reservations/updateReservation",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`/reservations/${id}`, data);
            return res.data; // במידה ותממשי בעתיד
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

/* --------------------  SLICE  -------------------- */

const reservationsSlice = createSlice({
    name: "reservations",
    initialState: {
        list: [],
        selected: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearSelected: (state) => {
            state.selected = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ------- fetchReservations ------- */
            .addCase(fetchReservations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            /* ------- fetchReservationById ------- */
            .addCase(fetchReservationById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReservationById.fulfilled, (state, action) => {
                state.loading = false;
                state.selected = action.payload;
            })
            .addCase(fetchReservationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(fetchMyReservations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;   // טוען רק את ההזמנות של המשתמש
            })
            .addCase(fetchMyReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            /* ------- createReservation ------- */
            .addCase(createReservation.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.error = action.payload;
            })

            /* ------- deleteReservation ------- */
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.list = state.list.filter((r) => r._id !== action.payload);
            })
            .addCase(deleteReservation.rejected, (state, action) => {
                state.error = action.payload;
            })

            /* ------- updateReservation ------- */
            .addCase(updateReservation.fulfilled, (state, action) => {
                const updated = action.payload;
                if (!updated || !updated._id) return;
                const idx = state.list.findIndex((r) => r._id === updated._id);
                if (idx !== -1) state.list[idx] = updated;
            })
            .addCase(updateReservation.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearSelected } = reservationsSlice.actions;
export default reservationsSlice.reducer;
