// src/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

// --- THUNKS --- //

// קבלת כל המשתמשים
export const fetchAllUsers = createAsyncThunk(
    "users/fetchAllUsers",
    async () => {
        const res = await axios.get("/users/list");
        return res.data;
    }
);

// יצירת משתמש חדש
export const createUser = createAsyncThunk(
    "users/createUser",
    async (newUser) => {
        const res = await axios.post("/users", newUser);
        return res.data;
    }
);
// שליפת פרטי משתמש לפי ID
export const fetchUserById = createAsyncThunk(
    "users/fetchUserById",
    async (id) => {
        const res = await axios.get(`/users/myInfo`);
        return res.data;
    }
);

// עדכון משתמש
export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, updatedFields }) => {
        const res = await axios.put(`/users/${id}`, updatedFields);
        return res.data;
    }
);

// מחיקת משתמש
export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id) => {
        await axios.delete(`/users/${id}`);
        return id;
    }
);


const usersSlice = createSlice({
    name: "users",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // --- CREATE USER --- //
            .addCase(createUser.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })

            // --- UPDATE USER --- //
            .addCase(updateUser.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.list.findIndex((u) => u._id === updated._id);
                if (idx !== -1) state.list[idx] = updated;
            })

            // --- DELETE USER --- //
            .addCase(deleteUser.fulfilled, (state, action) => {
                const id = action.payload;
                state.list = state.list.filter((u) => u._id !== id);
            });
    },
});

export default usersSlice.reducer;
