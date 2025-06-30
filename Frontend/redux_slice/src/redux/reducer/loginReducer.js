import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
  user: null,
  roles: [],
  users: []
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
        state.message = null;
      }
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },

    setMessage: (state, action) => {
      state.message = action.payload;
      state.error = null;
    },

    clearMessages: (state) => {
      state.message = null;
      state.error = null;
    },

    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setRoles: (state, action) => {
      state.roles = action.payload;
    },

    setUsers: (state, action) => {
      state.users = action.payload;
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.message = null;
    }
  }
});

export const { 
  setLoading, 
  setError, 
  setMessage, 
  clearMessages,
  setAuthentication, 
  setUser, 
  setRoles, 
  setUsers, 
  clearAuth 
} = loginSlice.actions;

export default loginSlice.reducer;