import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'react-toastify';

// État initial
const initialState = {
  entreprise: null,
  loading: false,
  error: null,
  isUpdating: false,
};

// Thunk pour récupérer le profil entreprise
export const fetchEntreprise = createAsyncThunk(
  'entreprise/fetchEntreprise',
  async (entrepriseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/company-profiles/${entrepriseId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération du profil entreprise'
      );
    }
  }
);

// Thunk pour créer/mettre à jour le profil entreprise
export const updateEntreprise = createAsyncThunk(
  'entreprise/updateEntreprise',
  async ({ entrepriseId, entrepriseData }, { rejectWithValue }) => {
    try {
      let response;
      
      if (entrepriseId) {
        // Mise à jour d'un profil existant
        response = await api.put(`/company-profiles/${entrepriseId}`, entrepriseData);
        toast.success('Profil entreprise mis à jour avec succès');
      } else {
        // Création d'un nouveau profil
        response = await api.post('/company-profiles', entrepriseData);
        toast.success('Profil entreprise créé avec succès');
      }
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la mise à jour du profil entreprise'
      );
    }
  }
);

// Thunk pour optimiser le profil entreprise avec l'IA
export const optimizeEntreprise = createAsyncThunk(
  'entreprise/optimizeEntreprise',
  async (entrepriseId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/company-profiles/optimize`, { entrepriseId });
      toast.success('Profil entreprise optimisé avec succès');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'optimisation du profil'
      );
    }
  }
);

// Thunk pour générer une vidéo/avatar pour l'entreprise
export const generateVideoEntreprise = createAsyncThunk(
  'entreprise/generateVideoEntreprise',
  async ({ entrepriseId, options }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/company-profiles/generate-video`, { 
        entrepriseId,
        options 
      });
      toast.success('Vidéo de présentation générée avec succès');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la génération de la vidéo'
      );
    }
  }
);

// Slice entreprise
const entrepriseSlice = createSlice({
  name: 'entreprise',
  initialState,
  reducers: {
    clearEntreprise: (state) => {
      state.entreprise = null;
    },
    clearEntrepriseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Entreprise
      .addCase(fetchEntreprise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntreprise.fulfilled, (state, action) => {
        state.loading = false;
        state.entreprise = action.payload;
      })
      .addCase(fetchEntreprise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Entreprise
      .addCase(updateEntreprise.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateEntreprise.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.entreprise = action.payload;
      })
      .addCase(updateEntreprise.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Optimize Entreprise
      .addCase(optimizeEntreprise.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(optimizeEntreprise.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.entreprise = action.payload;
      })
      .addCase(optimizeEntreprise.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Generate Video for Entreprise
      .addCase(generateVideoEntreprise.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(generateVideoEntreprise.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.entreprise = action.payload;
      })
      .addCase(generateVideoEntreprise.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });
  },
});

// Export des actions
export const { clearEntreprise, clearEntrepriseError } = entrepriseSlice.actions;

// Export des selectors
export const selectEntreprise = (state) => state.entreprise.entreprise;
export const selectEntrepriseLoading = (state) => state.entreprise.loading;
export const selectEntrepriseIsUpdating = (state) => state.entreprise.isUpdating;
export const selectEntrepriseError = (state) => state.entreprise.error;

export default entrepriseSlice.reducer;