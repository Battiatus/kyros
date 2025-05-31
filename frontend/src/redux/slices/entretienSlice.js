import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  entretiens: [],
  currentEntretien: null,
  loading: false,
  error: null,
};

// Thunk pour récupérer les entretiens
export const fetchEntretiens = createAsyncThunk(
  'entretien/fetchEntretiens',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/interviews', { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération des entretiens'
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
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de l\'entretien'
      );
    }
  }
);

// Thunk pour créer un nouvel entretien
export const createEntretien = createAsyncThunk(
  'entretien/createEntretien',
  async (entretienData, { rejectWithValue }) => {
    try {
      const response = await api.post('/interviews', entretienData);
      toast.success('Entretien planifié avec succès');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la création de l\'entretien'
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
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour de l\'entretien'
      );
    }
  }
);

// Thunk pour confirmer un entretien
export const confirmEntretien = createAsyncThunk(
  'entretien/confirmEntretien',
  async (entretienId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/interviews/${entretienId}/confirm`);
      toast.success('Entretien confirmé avec succès');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la confirmation de l\'entretien'
      );
    }
  }
);

// Thunk pour annuler un entretien
export const cancelEntretien = createAsyncThunk(
  'entretien/cancelEntretien',
  async ({ entretienId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/interviews/${entretienId}/cancel`, { reason });
      toast.success('Entretien annulé avec succès');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'annulation de l\'entretien'
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
        state.entretiens = action.payload;
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
        state.entretiens.push(action.payload);
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
        state.entretiens = state.entretiens.map(entretien =>
          entretien.id === action.payload.id ? action.payload : entretien
        );
      })
      .addCase(updateEntretien.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Confirm Entretien
      .addCase(confirmEntretien.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmEntretien.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEntretien = action.payload;
        state.entretiens = state.entretiens.map(entretien =>
          entretien.id === action.payload.id ? action.payload : entretien
        );
      })
      .addCase(confirmEntretien.rejected, (state, action) => {
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
        state.entretiens = state.entretiens.map(entretien =>
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
export const selectEntretienLoading = (state) => state.entretien.loading;
export const selectEntretienError = (state) => state.entretien.error;

export default entretienSlice.reducer;