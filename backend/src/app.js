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

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const offreRoutes = require('./routes/offreRoutes');
const candidatureRoutes = require('./routes/candidatureRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const messageRoutes = require('./routes/messageRoutes');
const entretienRoutes = require('./routes/entretienRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const referentRoutes = require('./routes/referentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

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

// Middlewares globaux
app.use(cors());
app.use(helmet());

// Middleware spécial pour les webhooks Stripe (avant express.json())
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/jobs', offreRoutes);
app.use('/api/v1/applications', candidatureRoutes);
app.use('/api/v1/companies', entrepriseRoutes);
app.use('/api/v1/conversations', messageRoutes);
app.use('/api/v1/interviews', entretienRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/references', referentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);


// Page de documentation web
app.get('/documentation', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/documentation.html'));
});

// Route racine pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Hereoz!',
    version: '1.0.0',
    documentation: '/api-docs',
    status: 'online',
    routes: {
      auth: '/api/v1/auth',
      profiles: '/api/v1/profiles',
      jobs: '/api/v1/jobs',
      applications: '/api/v1/applications',
      companies: '/api/v1/companies',
      conversations: '/api/v1/conversations',
      interviews: '/api/v1/interviews',
      payments: '/api/v1/payments',
      references: '/api/v1/references',
      admin: '/api/v1/admin',
      ai: '/api/v1/ai' // Nouvelle route IA
    }
  });
});

// Configuration WebSocket pour la messagerie temps réel
io.on('connection', (socket) => {
  logger.info(`Nouvelle connexion WebSocket: ${socket.id}`);
  
  // Authentification WebSocket
  socket.on('authenticate', (token) => {
    // TODO: Implémenter l'authentification par token JWT
    // Vérifier le token et associer l'utilisateur au socket
  });
  
  // Rejoindre une conversation
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    logger.info(`Socket ${socket.id} a rejoint la conversation ${conversationId}`);
  });
  
  // Quitter une conversation
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    logger.info(`Socket ${socket.id} a quitté la conversation ${conversationId}`);
  });
  
  // Gérer la saisie en cours
  socket.on('typing', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', {
      userId: data.userId,
      conversationId: data.conversationId
    });
  });
  
  // Arrêter la saisie
  socket.on('stop_typing', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_stop_typing', {
      userId: data.userId,
      conversationId: data.conversationId
    });
  });
  
  // Déconnexion
  socket.on('disconnect', () => {
    logger.info(`Déconnexion WebSocket: ${socket.id}`);
  });
});

// Exporter io pour utilisation dans les services
module.exports.io = io;

// Middlewares de gestion d'erreurs (doivent être en dernier)
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const PORT = config.port;
server.listen(PORT, () => {
  logger.info(`🚀 Serveur Hereoz démarré sur le port ${PORT} en mode ${config.env}`);
  logger.info(`📚 Documentation API disponible sur http://localhost:${PORT}/api-docs`);
  logger.info(`🌐 Documentation web disponible sur http://localhost:${PORT}/documentation`);
  
  // Afficher la liste des routes disponibles
  logger.info('📋 Routes API disponibles:');
  logger.info('   • Authentication: /api/v1/auth');
  logger.info('   • Profils: /api/v1/profiles');
  logger.info('   • Offres: /api/v1/jobs');
  logger.info('   • Candidatures: /api/v1/applications');
  logger.info('   • Entreprises: /api/v1/companies');
  logger.info('   • Conversations: /api/v1/conversations');
  logger.info('   • Entretiens: /api/v1/interviews');
  logger.info('   • Paiements: /api/v1/payments');
  logger.info('   • Références: /api/v1/references');
  logger.info('   • Administration: /api/v1/admin');
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