/**
 * Configuration du store Redux pour l'admin
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Slices
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import entreprisesReducer from './slices/entreprisesSlice';
import offresReducer from './slices/offresSlice';
import paymentsReducer from './slices/paymentsSlice';
import statsReducer from './slices/statsSlice';
import uiReducer from './slices/uiSlice';

// Configuration de la persistence
const persistConfig = {
  key: 'admin-root',
  storage,
  whitelist: ['auth'], // Seul le state auth sera persisté
};

// Combinaison des reducers
const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  entreprises: entreprisesReducer,
  offres: offresReducer,
  payments: paymentsReducer,
  stats: statsReducer,
  ui: uiReducer,
});

// Application de la persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Persistor pour PersistGate
export const persistor = persistStore(store);

export default store;