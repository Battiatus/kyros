import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  dashboardStats: null,
  offreStats: null,
  loading: false,
  error: null,
};

// Thunk pour récupérer les statistiques du dashboard
export const fetchDashboardStats = createAsyncThunk(
  'stats/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/stats/dashboard');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  }
);

// Thunk pour récupérer les statistiques d'une offre
export const fetchOffreStats = createAsyncThunk(
  'stats/fetchOffreStats',
  async (offreId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stats/job/${offreId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques de l\'offre'
      );
    }
  }
);

// Slice stats
const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStats: (state) => {
      state.dashboardStats = null;
      state.offreStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Offre Stats
      .addCase(fetchOffreStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffreStats.fulfilled, (state, action) => {
        state.loading = false;
        state.offreStats = action.payload;
      })
      .addCase(fetchOffreStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { clearStats } = statsSlice.actions;

// Export des selectors
export const selectDashboardStats = (state) => state.stats.dashboardStats;
export const selectOffreStats = (state) => state.stats.offreStats;
export const selectDashboardLoading = (state) => state.stats.loading;
export const selectStatsError = (state) => state.stats.error;

export default statsSlice.reducer;