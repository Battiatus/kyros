/**
 * Slice Redux pour les entretiens
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  entretiens: [],
  currentEntretien: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  loading: false,
  error: null,
};

// Thunk pour récupérer les entretiens avec filtres
export const fetchEntretiens = createAsyncThunk(
  'entretien/fetchEntretiens',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/interviews', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de la récupération des entretiens'
      );
    }
  }
);

// Thunk pour récupérer un entretien par ID
export const fetchEntretienById = createAsyncThunk(
  'entretien/fetchEntretienById',
  async (entretienId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/interviews/${entretienId}`);
      return response.data.data.entretien;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de la récupération de l\'entretien'
      );
    }
  }
);

// Thunk pour créer un entretien
export const createEntretien = createAsyncThunk(
  'entretien/createEntretien',
  async (entretienData, { rejectWithValue }) => {
    try {
      const response = await api.post('/interviews', entretienData);
      toast.success('Entretien créé avec succès');
      return response.data.data.entretien;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de la création de l\'entretien'
      );
    }
  }
);

// Thunk pour mettre à jour un entretien
export const updateEntretien = createAsyncThunk(
  'entretien/updateEntretien',
  async ({ entretienId, entretienData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/interviews/${entretienId}`, entretienData);
      toast.success('Entretien mis à jour avec succès');
      return response.data.data.entretien;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de la mise à jour de l\'entretien'
      );
    }
  }
);

// Thunk pour annuler un entretien
export const cancelEntretien = createAsyncThunk(
  'entretien/cancelEntretien',
  async ({ entretienId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/interviews/${entretienId}`, { 
        status: 'cancelled',
        notes: reason 
      });
      toast.success('Entretien annulé avec succès');
      return response.data.data.entretien;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Erreur lors de l\'annulation de l\'entretien'
      );
    }
  }
);

// Slice entretien
const entretienSlice = createSlice({
  name: 'entretien',
  initialState,
  reducers: {
    clearCurrentEntretien: (state) => {
      state.currentEntretien = null;
    },
    clearEntretienError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Entretiens
      .addCase(fetchEntretiens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntretiens.fulfilled, (state, action) => {
        state.loading = false;
        state.entretiens = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEntretiens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Entretien By Id
      .addCase(fetchEntretienById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntretienById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEntretien = action.payload;
      })
      .addCase(fetchEntretienById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Entretien
      .addCase(createEntretien.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEntretien.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEntretien = action.payload;
        state.entretiens = [action.payload, ...state.entretiens];
      })
      .addCase(createEntretien.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Entretien
      .addCase(updateEntretien.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntretien.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEntretien = action.payload;
        state.entretiens = state.entretiens.map((entretien) =>
          entretien.id === action.payload.id ? action.payload : entretien
        );
      })
      .addCase(updateEntretien.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Entretien
      .addCase(cancelEntretien.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelEntretien.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEntretien = action.payload;
        state.entretiens = state.entretiens.map((entretien) =>
          entretien.id === action.payload.id ? action.payload : entretien
        );
      })
      .addCase(cancelEntretien.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { clearCurrentEntretien, clearEntretienError } = entretienSlice.actions;

// Export des selectors
export const selectAllEntretiens = (state) => state.entretien.entretiens;
export const selectCurrentEntretien = (state) => state.entretien.currentEntretien;
export const selectEntretienPagination = (state) => state.entretien.pagination;
export const selectEntretienLoading = (state) => state.entretien.loading;
export const selectEntretienError = (state) => state.entretien.error;

export default entretienSlice.reducer;