import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const initialState = {
  token: token || null,
  user: token ? JSON.parse(atob(token.split('.')[1])) : null // quick decode (no verify)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    }
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
