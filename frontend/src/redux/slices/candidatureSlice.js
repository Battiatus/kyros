/**
 * Slice Redux pour les candidatures
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidatures: [],
  loading: false,
  error: null,
};

const candidatureSlice = createSlice({
  name: 'candidature',
  initialState,
  reducers: {
    // Actions à implémenter selon les besoins
  },
});

export default candidatureSlice.reducer;