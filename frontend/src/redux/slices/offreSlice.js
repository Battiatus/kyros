/**
 * Slice Redux pour les offres d'emploi
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  offres: [],
  suggestedOffres: [],
  currentOffre: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  loading: false,
  error: null,
  stats: null,
};

// Thunk pour récupérer les offres avec filtres
export const fetchOffres = createAsyncThunk(
  'offre/fetchOffres',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/jobs', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des offres'
      );
    }
  }
);

// Thunk pour récupérer les offres suggérées
export const fetchSuggestedOffres = createAsyncThunk(
  'offre/fetchSuggestedOffres',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/jobs/suggested', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des suggestions'
      );
    }
  }
);

// Thunk pour récupérer une offre par ID
export const fetchOffreById = createAsyncThunk(
  'offre/fetchOffreById',
  async (offreId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${offreId}`);
      return response.data.data.offre;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de l\'offre'
      );
    }
  }
);

// Thunk pour créer une offre
export const createOffre = createAsyncThunk(
  'offre/createOffre',
  async (offreData, { rejectWithValue }) => {
    try {
      const response = await api.post('/jobs', offreData);
      toast.success('Offre créée avec succès');
      return response.data.data.offre;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création de l\'offre'
      );
    }
  }
);

// Thunk pour mettre à jour une offre
export const updateOffre = createAsyncThunk(
  'offre/updateOffre',
  async ({ offreId, offreData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jobs/${offreId}`, offreData);
      toast.success('Offre mise à jour avec succès');
      return response.data.data.offre;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour de l\'offre'
      );
    }
  }
);

// Thunk pour clôturer une offre
export const closeOffre = createAsyncThunk(
  'offre/closeOffre',
  async (offreId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jobs/${offreId}/close`);
      toast.success('Offre clôturée avec succès');
      return response.data.data.offre;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la clôture de l\'offre'
      );
    }
  }
);

// Thunk pour optimiser une offre avec l'IA
export const optimizeOffre = createAsyncThunk(
  'offre/optimizeOffre',
  async (offreId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jobs/${offreId}/optimize`);
      toast.success('Offre optimisée avec succès');
      return response.data.data.offre;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'optimisation de l\'offre'
      );
    }
  }
);

// Thunk pour récupérer les statistiques d'une offre
export const fetchOffreStats = createAsyncThunk(
  'offre/fetchOffreStats',
  async (offreId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${offreId}/stats`);
      return response.data.data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      );
    }
  }
);

// Slice offre
const offreSlice = createSlice({
  name: 'offre',
  initialState,
  reducers: {
    clearCurrentOffre: (state) => {
      state.currentOffre = null;
    },
    clearOffreError: (state) => {
      state.error = null;
    },
    resetOffres: (state) => {
      state.offres = [];
      state.suggestedOffres = [];
      state.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Offres
      .addCase(fetchOffres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffres.fulfilled, (state, action) => {
        state.loading = false;
        state.offres = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOffres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Suggested Offres
      .addCase(fetchSuggestedOffres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedOffres.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestedOffres = action.payload.data.suggestions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSuggestedOffres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Offre By Id
      .addCase(fetchOffreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffreById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOffre = action.payload;
      })
      .addCase(fetchOffreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Offre
      .addCase(createOffre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOffre.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOffre = action.payload;
        // Ajouter la nouvelle offre au début de la liste
        state.offres = [action.payload, ...state.offres];
      })
      .addCase(createOffre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Offre
      .addCase(updateOffre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOffre.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOffre = action.payload;
        // Mettre à jour l'offre dans la liste
        state.offres = state.offres.map(offre => 
          offre._id === action.payload._id ? action.payload : offre
        );
      })
      .addCase(updateOffre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Close Offre
      .addCase(closeOffre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeOffre.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOffre = action.payload;
        // Mettre à jour l'offre dans la liste
        state.offres = state.offres.map(offre => 
          offre._id === action.payload._id ? action.payload : offre
        );
      })
      .addCase(closeOffre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Optimize Offre
      .addCase(optimizeOffre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(optimizeOffre.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOffre = action.payload;
        // Mettre à jour l'offre dans la liste
        state.offres = state.offres.map(offre => 
          offre._id === action.payload._id ? action.payload : offre
        );
      })
      .addCase(optimizeOffre.rejected, (state, action) => {
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
        state.stats = action.payload;
      })
      .addCase(fetchOffreStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { clearCurrentOffre, clearOffreError, resetOffres } = offreSlice.actions;

// Export des selectors
export const selectAllOffres = (state) => state.offre.offres;
export const selectSuggestedOffres = (state) => state.offre.suggestedOffres;
export const selectCurrentOffre = (state) => state.offre.currentOffre;
export const selectOffrePagination = (state) => state.offre.pagination;
export const selectOffreLoading = (state) => state.offre.loading;
export const selectOffreError = (state) => state.offre.error;
export const selectOffreStats = (state) => state.offre.stats;

export default offreSlice.reducer;