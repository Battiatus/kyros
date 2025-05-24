/**
 * Configuration globale de l'admin
 */

const config = {
    // URL de l'API backend
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
    
    // Environnement
    env: process.env.REACT_APP_ENV || 'development',
    
    // Délai d'expiration des requêtes API (ms)
    apiTimeout: 15000,
    
    // Délai de notification (ms)
    notificationDuration: 5000,
    
    // Pagination par défaut
    defaultPagination: {
      limit: 25,
    },
    
    // Intervalle d'actualisation des données (ms)
    refreshInterval: 30000,
    
    // Configuration des graphiques
    charts: {
      colors: {
        primary: '#1976D2',
        secondary: '#DC004E',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
      },
    },
  };
  
  export default config;