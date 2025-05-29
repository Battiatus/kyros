import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  candidatures: [],
  currentCandidature: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  loading: false,
  error: null,
};

// Thunk pour récupérer les candidatures
export const fetchCandidatures = createAsyncThunk(
  'candidature/fetchCandidatures',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/applications', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des candidatures'
      );
    }
  }
);

// Thunk pour récupérer une candidature par ID
export const fetchCandidatureById = createAsyncThunk(
  'candidature/fetchCandidatureById',
  async (candidatureId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/applications/${candidatureId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de la candidature'
      );
    }
  }
);

// Thunk pour mettre à jour le statut d'une candidature
export const updateCandidatureStatus = createAsyncThunk(
  'candidature/updateCandidatureStatus',
  async ({ candidatureId, status, notes, rejectReason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/applications/${candidatureId}/status`, {
        status,
        notes,
        rejectReason,
      });
      toast.success('Statut de la candidature mis à jour');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour du statut'
      );
    }
  }
);

// Thunk pour ajouter une note à une candidature
export const addNoteToCandidature = createAsyncThunk(
  'candidature/addNoteToCandidature',
  async ({ candidatureId, notes }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/applications/${candidatureId}`, { notes });
      toast.success('Note ajoutée avec succès');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'ajout de la note'
      );
    }
  }
);

// Slice candidature
const candidatureSlice = createSlice({
  name: 'candidature',
  initialState,
  reducers: {
    clearCurrentCandidature: (state) => {
      state.currentCandidature = null;
    },
    clearCandidatureError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Candidatures
      .addCase(fetchCandidatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidatures.fulfilled, (state, action) => {
        state.loading = false;
        state.candidatures = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCandidatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Candidature By Id
      .addCase(fetchCandidatureById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidatureById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCandidature = action.payload;
      })
      .addCase(fetchCandidatureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Candidature Status
      .addCase(updateCandidatureStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidatureStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCandidature = action.payload;
        // Mettre à jour la candidature dans la liste
        state.candidatures = state.candidatures.map((candidature) =>
          candidature.id === action.payload.id ? action.payload : candidature
        );
      })
      .addCase(updateCandidatureStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Note to Candidature
      .addCase(addNoteToCandidature.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNoteToCandidature.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCandidature = action.payload;
        // Mettre à jour la candidature dans la liste
        state.candidatures = state.candidatures.map((candidature) =>
          candidature.id === action.payload.id ? action.payload : candidature
        );
      })
      .addCase(addNoteToCandidature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { clearCurrentCandidature, clearCandidatureError } = candidatureSlice.actions;

// Export des selectors
export const selectAllCandidatures = (state) => state.candidature.candidatures;
export const selectCurrentCandidature = (state) => state.candidature.currentCandidature;
export const selectCandidaturePagination = (state) => state.candidature.pagination;
export const selectCandidatureLoading = (state) => state.candidature.loading;
export const selectCandidatureError = (state) => state.candidature.error;

export default candidatureSlice.reducer;