import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAuth, clearAuth, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
