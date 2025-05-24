import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payments: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 25, pages: 0 },
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
});

export default paymentsSlice.reducer;