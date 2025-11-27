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

// export const fetchAllUsersManage = createAsyncThunk(
//     "users/fetchAllUsersManage",
//     async () => {
//         const res = await axios.get("/users/list/manage");
//         return res.data;
//     }
// );

// יצירת משתמש חדש
export const createUser = createAsyncThunk(
    "users/createUser",
    async (newUser) => {
        const res = await axios.post("/users/register", newUser);
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
        const res = await axios.put(`/users/update/${id}`, updatedFields);
        return res.data;
    }
);

export const toggleUserActive = createAsyncThunk(
    "users/toggleUserActive",
    async (id) => {
        const res = await axios.patch(`/users/toggleActive/${id}`);
        return res.data;
    }
);

// מחיקת משתמש
// export const deleteUser = createAsyncThunk(
//     "users/deleteUser",
//     async (id, { rejectWithValue }) => {
//         try {
//             await axios.delete(`/users/${id}`);
//             return id;
//         } catch (err) {
//             return rejectWithValue(err.response?.data || { msg: "שגיאה במחיקת המשתמש" });
//         }
//     }
// );

// export const checkCanDelete = createAsyncThunk(
//     "users/checkCanDelete",
//     async (id) => {
//         const res = await axios.get(`/users/canDelete/${id}`);
//         return { id, canDelete: res.data.canDelete };
//     }
// );

export const checkEmailExists = createAsyncThunk(
    "users/checkEmailExists",
    async (email) => {
        const res = await axios.post("/users/checkEmail", { email });
        return res.data; // מחזיר { exists: true/false }
    }
);



const usersSlice = createSlice({
    name: "users",
    initialState: {
        list: [],
        loading: false,
        error: null,
        emailExists: null,
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
            // .addCase(fetchAllUsersManage.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchAllUsersManage.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.list = action.payload;
            // })
            // .addCase(fetchAllUsersManage.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // })

            // --- CREATE USER --- //
            .addCase(createUser.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })

            // --- UPDATE USER --- //
            .addCase(updateUser.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.list.findIndex((u) => u._id === updated._id);
                if (idx !== -1) {
                    state.list[idx] = updated
                };
            })

            .addCase(toggleUserActive.fulfilled, (state, action) => {
                const id = action.meta.arg;
                const idx = state.list.findIndex(u => u._id === id);
                if (idx !== -1) {
                    state.list[idx].isActive = !state.list[idx].isActive;
                }
            })
            // .addCase(toggleUserActive.fulfilled, (state, action) => {
            //     const updated = action.payload;
            //     const idx = state.list.findIndex((u) => u._id === updated._id);
            //     if (idx !== -1) {
            //         state.list[idx].isActive = updated.isActive;
            //     }
            // })

            // --- DELETE USER --- //
            // .addCase(deleteUser.fulfilled, (state, action) => {
            //     const id = action.payload;
            //     state.list = state.list.filter((u) => u._id !== id);
            // })
            // .addCase(deleteUser.rejected, (state, action) => {
            //     state.error = action.payload?.msg || "לא ניתן למחוק את המשתמש";
            // })

            // .addCase(checkCanDelete.fulfilled, (state, action) => {
            //     const idx = state.list.findIndex(u => u._id === action.payload.id);
            //     if (idx !== -1) state.list[idx].canDelete = action.payload.canDelete;
            // })
            

            // --- CHECK EMAIL EXISTS --- //
            .addCase(checkEmailExists.pending, (state) => {
                state.emailExists = null;
            })
            .addCase(checkEmailExists.fulfilled, (state, action) => {
                state.emailExists = action.payload.exists;
            })
            .addCase(checkEmailExists.rejected, (state) => {
                state.emailExists = null;
            })
            ;
    },
});

export default usersSlice.reducer;
