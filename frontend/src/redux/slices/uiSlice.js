import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  isLoading: false,
  filters: {
    candidatures: {
      status: 'all',
      search: '',
      sortField: 'date',
      sortOrder: 'desc',
    },
    offres: {
      status: 'all',
      search: '',
      sortField: 'date',
      sortOrder: 'desc',
    },
    entretiens: {
      status: 'all',
      search: '',
      sortField: 'date',
      sortOrder: 'desc',
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateFilters: (state, action) => {
      const { category, filters } = action.payload;
      state.filters[category] = {
        ...state.filters[category],
        ...filters,
      };
    },
    resetFilters: (state, action) => {
      const category = action.payload;
      state.filters[category] = initialState.filters[category];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  addNotification,
  removeNotification,
  setIsLoading,
  updateFilters,
  resetFilters,
} = uiSlice.actions;

export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectFilters = (category) => (state) => state.ui.filters[category];

export default uiSlice.reducer;