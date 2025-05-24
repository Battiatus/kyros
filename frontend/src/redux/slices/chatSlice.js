/**
 * Slice Redux pour le chat
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Actions à implémenter selon les besoins
  },
});

export default chatSlice.reducer;