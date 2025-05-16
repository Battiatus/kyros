/**
 * Configuration globale du frontend
 */

const config = {
    // URL de l'API backend
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
    
    // URL pour les WebSockets
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000',
    
    // Environnement
    env: process.env.REACT_APP_ENV || 'development',
    
    // Délai d'expiration des requêtes API (ms)
    apiTimeout: 15000,
    
    // Options du système de swipe
    swipe: {
      threshold: 50, // Seuil minimum pour déclencher le swipe
      velocity: 0.3, // Vélocité minimum pour déclencher le swipe
    },
    
    // Délai de notification (ms)
    notificationDuration: 5000,
    
    // Pagination par défaut
    defaultPagination: {
      limit: 10,
    },
    
    // URLs OAuth
    oauth: {
      google: `${process.env.REACT_APP_API_URL}/auth/google`,
      linkedin: `${process.env.REACT_APP_API_URL}/auth/linkedin`,
    },
    
    // Intervalle d'actualisation des données (ms)
    refreshInterval: 60000,
  };
  
  export default config;