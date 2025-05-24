/**
 * Utilitaire pour les appels API de l'admin
 */

import axios from 'axios';
import config from '../config/config';
import { toast } from 'react-toastify';

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
    // Récupérer le token depuis le localStorage pour éviter les imports circulaires
    const persistedState = localStorage.getItem('persist:admin-root');
    if (persistedState) {
      try {
        const state = JSON.parse(persistedState);
        const authState = JSON.parse(state.auth);
        const token = authState.token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du token:', error);
      }
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
    // Gestion de l'expiration du token
    if (error.response?.status === 401) {
      // Supprimer le token du localStorage
      localStorage.removeItem('persist:admin-root');
      toast.error('Votre session a expiré. Veuillez vous reconnecter.');
      // Rediriger vers la page de connexion
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Gestion des erreurs 400 et 500
    if (error.response?.status === 400) {
      toast.error(error.response.data.message || 'Données invalides. Veuillez vérifier votre saisie.');
    } else if (error.response?.status === 403) {
      toast.error('Accès refusé. Vous n\'avez pas les droits nécessaires.');
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

// Export par défaut
export default api;