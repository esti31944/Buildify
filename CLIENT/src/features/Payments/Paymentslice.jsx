// src/features/payments/paymentsSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

// --- THUNKS --- //

// כל התשלומים (ועד בלבד)
export const fetchAllPayments = createAsyncThunk(
  "payments/fetchAllPayments",
  async () => {
    const res = await axios.get("/payments");
    return res.data;
  }
);

// התשלומים של המשתמש המחובר
export const fetchMyPayments = createAsyncThunk(
  "payments/fetchMyPayments",
  async () => {
    const res = await axios.get("/payments/myPayments");
    console.log(res.data, "hi");

    return res.data;
  }
);

// יצירת תשלום חדש
export const createPayment = createAsyncThunk(
  "payments/createPayment",
  async (newPayment) => {
    const res = await axios.post("/payments", newPayment);
    return res.data;
  }
);

// עדכון תשלום
export const updatePayment = createAsyncThunk(
  "payments/updatePayment",
  async ({ id, updatedFields }) => {
    const res = await axios.put(`/payments/${id}`, updatedFields);
    return res.data;
  }
);

// מחיקת תשלום
export const deletePayment = createAsyncThunk(
  "payments/deletePayment",
  async (id) => {
    await axios.delete(`/payments/${id}`);
    return id;
  }
);

export const updatePaymentStatus = createAsyncThunk(
  "payments/updatePaymentStatus",
  async ({ id, status }) => {
    const res = await axios.put(`/payments/updateStatus/${id}`, { status });
    return res.data.payment;
  }
);


// --- SLICE --- //

const paymentsSlice = createSlice({
  name: "payments",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // --- GET MY PAYMENTS --- //
      .addCase(fetchMyPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- GET ALL PAYMENTS --- //
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // --- CREATE PAYMENT --- //
      .addCase(createPayment.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // --- UPDATE PAYMENT --- //
      .addCase(updatePayment.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((p) => p._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      })

      // --- DELETE PAYMENT --- //
      .addCase(deletePayment.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((p) => p._id !== id);
      })
      // --- UPDATE PAYMENT STATUS --- //
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((p) => p._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      })
      ;
  },
});

export default paymentsSlice.reducer;
