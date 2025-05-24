/**
 * Slice Redux pour l'authentification admin
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Thunk pour la connexion
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Vérifier que l'utilisateur est admin
      if (response.data.data.user.role !== 'admin_plateforme') {
        throw new Error('Accès refusé. Vous n\'êtes pas administrateur.');
      }
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Identifiants incorrects'
      );
    }
  }
);

// Thunk pour récupérer le profil utilisateur
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      
      // Vérifier que l'utilisateur est admin
      if (response.data.data.user.role !== 'admin_plateforme') {
        throw new Error('Accès refusé. Vous n\'êtes pas administrateur.');
      }
      
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(
        error.message || error.response?.data?.message || 'Erreur lors de la récupération du profil'
      );
    }
  }
);

// Thunk pour demander un nouveau mot de passe
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la demande de réinitialisation'
      );
    }
  }
);

// Slice auth
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      toast.info('Vous êtes déconnecté');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Si l'utilisateur n'est pas admin, le déconnecter
        if (action.payload?.includes('Accès refusé')) {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { logout, clearError } = authSlice.actions;

// Export des selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;