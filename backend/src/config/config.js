/**
 * Configuration centrale de l'application
 * @module config/config
 */

require('dotenv').config();

module.exports = {
  /**
   * Port du serveur
   */
  port: process.env.PORT || 3000,
  
  /**
   * Environnement de l'application
   */
  env: process.env.NODE_ENV || 'development',
  
  /**
   * Configuration de la base de données MongoDB
   */
  db: {
    uri: process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI
      : process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  /**
   * Configuration de JWT pour l'authentification
   */
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  /**
   * Configuration des emails
   */
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    from: process.env.EMAIL_FROM
  },
  
  /**
   * Configuration de Stripe pour les paiements
   */
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  
  /**
   * Configuration des authentifications OAuth
   */
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    linkedin: {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL
    }
  },
  
  /**
   * URLs des frontends
   */
  frontendUrls: {
    main: process.env.FRONTEND_URL,
    admin: process.env.ADMIN_FRONTEND_URL
  }
};