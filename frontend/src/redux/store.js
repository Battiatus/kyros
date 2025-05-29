/**
 * Configuration du store Redux
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Slices
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import offreReducer from './slices/offreSlice';
import candidatureReducer from './slices/candidatureSlice';
import entrepriseReducer from './slices/entrepriseSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import entretienReducer from './slices/entretienSlice';

// Configuration de la persistence
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Seul le state auth sera persisté
};

// Combinaison des reducers
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  offre: offreReducer,
  candidature: candidatureReducer,
  entreprise: entrepriseReducer,
  chat: chatReducer,
  ui: uiReducer,
  entretien: entretienReducer,
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