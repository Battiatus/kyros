import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  offres: [],
  currentOffre: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 25, pages: 0 },
};

const offresSlice = createSlice({
  name: 'offres',
  initialState,
  reducers: {},
});

export default offresSlice.reducer;