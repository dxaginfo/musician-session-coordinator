import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';

// Types
export interface User {
  id: number;
  email: string;
  user_type: 'musician' | 'producer' | 'studio';
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  bio?: string;
  location?: string;
  hourly_rate?: number;
  created_at: string;
  updated_at: string;
  musicianProfile?: {
    id: number;
    user_id: number;
    years_experience: number;
    studio_experience: boolean;
    remote_recording_capability: boolean;
    portfolio_url?: string;
    created_at: string;
    updated_at: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  user_type: 'musician' | 'producer' | 'studio';
  first_name: string;
  last_name: string;
  bio?: string;
  location?: string;
  hourly_rate?: number;
  years_experience?: number;
  studio_experience?: boolean;
  remote_recording_capability?: boolean;
  portfolio_url?: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const login = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterData, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk<User, void, { rejectValue: string; state: RootState }>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().auth;
    
    if (!token) {
      return rejectWithValue('No token found');
    }
    
    try {
      const response = await axios.get<{ user: User }>(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user data';
      return rejectWithValue(message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Login failed';
    });
    
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Registration failed';
    });
    
    // Get current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch user data';
      
      // If the token is invalid, log the user out
      if (action.payload === 'Invalid token' || action.payload === 'Token has expired') {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    });
  },
});

// Actions
export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;