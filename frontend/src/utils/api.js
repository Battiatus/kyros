/**
 * Utilitaire pour les appels API
 */

import axios from 'axios';
import config from '../config/config';
import { toast } from 'react-toastify';
import { refreshToken, logout } from '../redux/slices/authSlice';
import store from '../redux/store';

// Création de l'instance axios
const api = axios.create({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Gestion de l'expiration du token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentative de refresh du token
        const state = store.getState();
        if (state.auth.refreshToken) {
          const response = await axios.post(`${config.apiUrl}/auth/refresh-token`, {
            refreshToken: state.auth.refreshToken,
          });
          
          const { token } = response.data.data;
          store.dispatch(refreshToken(token));
          
          // Refaire la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } else {
          // Pas de refresh token, déconnexion
          store.dispatch(logout());
          toast.error('Votre session a expiré. Veuillez vous reconnecter.');
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Échec du refresh, déconnexion
        store.dispatch(logout());
        toast.error('Votre session a expiré. Veuillez vous reconnecter.');
        return Promise.reject(error);
      }
    }
    
    // Gestion des erreurs 400 et 500
    if (error.response?.status === 400) {
      toast.error(error.response.data.message || 'Données invalides. Veuillez vérifier votre saisie.');
    } else if (error.response?.status >= 500) {
      toast.error('Une erreur serveur s\'est produite. Veuillez réessayer plus tard.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('La connexion a pris trop de temps. Veuillez vérifier votre connexion internet.');
    } else if (!error.response) {
      toast.error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
    }
    
    return Promise.reject(error);
  }
);

export default api;