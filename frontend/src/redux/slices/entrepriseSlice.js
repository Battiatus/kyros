/**
 * Slice Redux pour les entreprises
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entreprise: null,
  loading: false,
  error: null,
};

const entrepriseSlice = createSlice({
  name: 'entreprise',
  initialState,
  reducers: {
    // Actions à implémenter selon les besoins
  },
});

export default entrepriseSlice.reducer;