import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// État initial
const initialState = {
  candidatStats: null,
  recruteurStats: null,
  offreStats: null,
  companyStats: null,
  loading: false,
  error: null,
};

// Thunk pour récupérer les stats du recruteur
export const fetchRecruteurStats = createAsyncThunk(
  'statistics/fetchRecruteurStats',
  async (period, { rejectWithValue }) => {
    try {
      const response = await api.get('/stats/recruiter/me', { params: { period } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  }
);

// Thunk pour récupérer les stats de l'entreprise
export const fetchCompanyStats = createAsyncThunk(
  'statistics/fetchCompanyStats',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/stats/company/me', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  }
);

// Thunk pour récupérer les stats d'une offre
export const fetchOffreStats = createAsyncThunk(
  'statistics/fetchOffreStats',
  async (offreId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stats/job/${offreId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  }
);

// Thunk pour récupérer les stats du candidat
export const fetchCandidatStats = createAsyncThunk(
  'statistics/fetchCandidatStats',
  async (period, { rejectWithValue }) => {
    try {
      const response = await api.get('/stats/candidate/me', { params: { period } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  }
);

// Slice des statistiques
const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearStats: (state) => {
      state.candidatStats = null;
      state.recruteurStats = null;
      state.offreStats = null;
      state.companyStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recruteur Stats
      .addCase(fetchRecruteurStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecruteurStats.fulfilled, (state, action) => {
        state.loading = false;
        state.recruteurStats = action.payload;
      })
      .addCase(fetchRecruteurStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Company Stats
      .addCase(fetchCompanyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.companyStats = action.payload;
      })
      .addCase(fetchCompanyStats.rejected, (state, action) => {
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
      })

      // Fetch Candidat Stats
      .addCase(fetchCandidatStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidatStats.fulfilled, (state, action) => {
        state.loading = false;
        state.candidatStats = action.payload;
      })
      .addCase(fetchCandidatStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { clearStats } = statisticsSlice.actions;

// Export des selectors
export const selectRecruteurStats = (state) => state.statistics.recruteurStats;
export const selectCompanyStats = (state) => state.statistics.companyStats;
export const selectOffreStats = (state) => state.statistics.offreStats;
export const selectCandidatStats = (state) => state.statistics.candidatStats;
export const selectStatisticsLoading = (state) => state.statistics.loading;
export const selectStatisticsError = (state) => state.statistics.error;

export default statisticsSlice.reducer;