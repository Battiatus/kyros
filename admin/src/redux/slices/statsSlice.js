import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalStats: null,
  chartsData: null,
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
});

export default statsSlice.reducer;