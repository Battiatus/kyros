/**
 * Slice Redux pour le profil utilisateur
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Actions à implémenter selon les besoins
  },
});

export default profileSlice.reducer;