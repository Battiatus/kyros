import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// Thunk pour récupérer le profil
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/profiles/${userId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération du profil'
      );
    }
  }
);

// Thunk pour mettre à jour le profil
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/profiles/${userId}`, profileData);
      toast.success('Profil mis à jour avec succès');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
      );
    }
  }
);

// Slice profile
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { clearProfile, clearProfileError } = profileSlice.actions;

// Export des selectors
export const selectProfile = (state) => state.profile.profile;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;

export default profileSlice.reducer;