import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entreprises: [],
  currentEntreprise: null,
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 25, pages: 0 },
};

const entreprisesSlice = createSlice({
  name: 'entreprises',
  initialState,
  reducers: {},
});

export default entreprisesSlice.reducer;