// /**
//  * Point d'entrée de l'application
//  * @module app
//  */

// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// const http = require('http');
// const socketIo = require('socket.io');
// const { connectDB } = require('./config/db');
// const config = require('./config/config');
// const logger = require('./utils/logger');
// const { specs, swaggerUi } = require('./utils/swagger');
// const { notFound, errorHandler } = require('./middlewares/error');

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const offreRoutes = require('./routes/offreRoutes');
// const candidatureRoutes = require('./routes/candidatureRoutes');
// const entrepriseRoutes = require('./routes/entrepriseRoutes');
// // Ajouter d'autres routes au besoin

// // Initialisation de l'app Express
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: [config.frontendUrls.main, config.frontendUrls.admin],
//     methods: ['GET', 'POST']
//   }
// });

// // Connexion à la base de données
// connectDB();

// // Middlewares
// app.use(cors());
// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));

// // Servir les fichiers statiques
// app.use(express.static(path.join(__dirname, '../public')));

// // Documentation Swagger
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// // Routes API
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/jobs', offreRoutes);
// app.use('/api/v1/applications', candidatureRoutes);
// app.use('/api/v1/companies', entrepriseRoutes);
// // Ajouter d'autres routes au besoin

// // Page de documentation web
// app.get('/documentation', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/documentation.html'));
// });

// // Route racine pour vérifier que l'API fonctionne
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Bienvenue sur l\'API Hereoz!',
//     documentation: '/api-docs',
//     status: 'online'
//   });
// });

// // Middleware de gestion d'erreurs
// app.use(notFound);
// app.use(errorHandler);

// // Configuration WebSocket
// io.on('connection', (socket) => {
//   logger.info(`Nouvelle connexion WebSocket: ${socket.id}`);
  
//   // Authentification WebSocket
//   socket.on('authenticate', (token) => {
//     // Implémentation de l'authentification par token JWT
//     // À compléter selon les besoins
//   });
  
//   // Événement de chat
//   socket.on('message', (data) => {
//     // Gestion des messages
//     // À compléter selon les besoins
//   });
  
//   // Déconnexion
//   socket.on('disconnect', () => {
//     logger.info(`Déconnexion WebSocket: ${socket.id}`);
//   });
// });

// // Démarrage du serveur
// const PORT = config.port;
// server.listen(PORT, () => {
//   logger.info(`Serveur démarré sur le port ${PORT} en mode ${config.env}`);
//   logger.info(`Documentation API disponible sur http://localhost:${PORT}/api-docs`);
// });

// // Gestion des exceptions non capturées
// process.on('uncaughtException', (err) => {
//   logger.error('Exception non capturée:', err);
//   process.exit(1);
// });

// // Gestion des rejets de promesses non capturés
// process.on('unhandledRejection', (err) => {
//   logger.error('Rejet de promesse non capturé:', err);
//   process.exit(1);
// });

// module.exports = { app, server, io };


/**
 * Point d'entrée de l'application
 * @module app
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./config/db');
const config = require('./config/config');
const logger = require('./utils/logger');
const { specs, swaggerUi } = require('./utils/swagger');
const { notFound, errorHandler } = require('./middlewares/error');

// Routes existantes
const authRoutes = require('./routes/authRoutes');
const offreRoutes = require('./routes/offreRoutes');
const candidatureRoutes = require('./routes/candidatureRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');

// Initialisation de l'app Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [config.frontendUrls.main, config.frontendUrls.admin],
    methods: ['GET', 'POST']
  }
});

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', offreRoutes);
app.use('/api/v1/applications', candidatureRoutes);
app.use('/api/v1/companies', entrepriseRoutes);

// Page de documentation web
app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/documentation.html'));
});

// Route racine pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Hereoz!',
    documentation: '/api-docs',
    status: 'online'
  });
});

// Middleware de gestion d'erreurs
app.use(notFound);
app.use(errorHandler);

// Configuration WebSocket
io.on('connection', (socket) => {
  logger.info(`Nouvelle connexion WebSocket: ${socket.id}`);
  
  // Authentification WebSocket
  socket.on('authenticate', (token) => {
    // Implémentation de l'authentification par token JWT
    // À compléter selon les besoins
  });
  
  // Événement de chat
  socket.on('message', (data) => {
    // Gestion des messages
    // À compléter selon les besoins
  });
  
  // Déconnexion
  socket.on('disconnect', () => {
    logger.info(`Déconnexion WebSocket: ${socket.id}`);
  });
});

// Démarrage du serveur
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT} en mode ${config.env}`);
  logger.info(`Documentation API disponible sur http://localhost:${PORT}/api-docs`);
});

// Gestion des exceptions non capturées
process.on('uncaughtException', (err) => {
  logger.error('Exception non capturée:', err);
  process.exit(1);
});

// Gestion des rejets de promesses non capturés
process.on('unhandledRejection', (err) => {
  logger.error('Rejet de promesse non capturé:', err);
  process.exit(1);
});

module.exports = { app, server, io };