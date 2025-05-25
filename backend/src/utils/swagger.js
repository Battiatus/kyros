/**
 * Configuration de Swagger pour la documentation API
 * @module utils/swagger
 */
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config/config');
const swaggerCustomOptions = require('./swagger-custom');

// Logo en base64 pour l'intégrer dans la documentation
const logoBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHBhdGggZD0iTTE0IDIwSDI2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8cGF0aCBkPSJNMjAgMTRWMjYiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPg==';

// Options de configuration Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Hereoz',
      version: '1.0.0',
      description: `
# 🚀 Bienvenue sur la documentation de l'API Hereoz

**Hereoz** est la plateforme de recrutement révolutionnaire dédiée au secteur de l'hôtellerie-restauration. 
Notre API RESTful permet une intégration complète avec tous les services de la plateforme.

## 🎯 Fonctionnalités principales

- **Matching intelligent** : Algorithme de compatibilité candidat/offre basé sur l'IA
- **Système de swipe** : Interface intuitive inspirée des applications de rencontre
- **Validation des expériences** : Vérification par référents professionnels
- **Messagerie temps réel** : Communication instantanée via WebSocket
- **Gestion des entretiens** : Planification et visioconférence intégrées
- **Paiements sécurisés** : Intégration Stripe pour les abonnements

## 🔐 Authentification

L'API utilise des tokens JWT pour l'authentification. Incluez le token dans l'en-tête de vos requêtes :

\`\`\`
Authorization: Bearer {votre_token_jwt}
\`\`\`

## 📊 Limites de taux

- **Requêtes authentifiées** : 1000 requêtes/heure
- **Requêtes non authentifiées** : 100 requêtes/heure

## 🌐 Environnements

- **Production** : https://api.hereoz.com
- **Staging** : https://staging-api.hereoz.com
- **Développement** : http://localhost:3000

## 📚 Ressources

- [Documentation complète](https://docs.hereoz.com)
- [Statut de l'API](https://status.hereoz.com)
- [Changelog](https://github.com/hereoz/api/releases)
- [Support technique](mailto:api-support@hereoz.com)

---

<img src="${logoBase64}" alt="Hereoz" width="100" style="display: block; margin: 20px auto;">
      `,
      termsOfService: 'https://hereoz.com/terms',
      contact: {
        name: 'Support API Hereoz',
        email: 'api-support@hereoz.com',
        url: 'https://support.hereoz.com'
      },
      license: {
        name: 'Propriétaire',
        url: 'https://hereoz.com/license'
      },
      'x-logo': {
        url: logoBase64,
        altText: 'Hereoz Logo'
      }
    },
    externalDocs: {
      description: 'Documentation complète Hereoz',
      url: 'https://docs.hereoz.com'
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: 'Serveur de développement local'
      },
      {
        url: 'https://staging-api.hereoz.com/api/v1',
        description: 'Serveur de staging'
      },
      {
        url: 'https://api.hereoz.com/api/v1',
        description: 'Serveur de production'
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentification et gestion des sessions'
      },
      {
        name: 'Profils',
        description: 'Gestion des profils utilisateurs'
      },
      {
        name: 'Offres',
        description: 'Création et gestion des offres d\'emploi'
      },
      {
        name: 'Candidatures',
        description: 'Gestion des candidatures et matching'
      },
      {
        name: 'Entreprises',
        description: 'Gestion des profils entreprises'
      },
      {
        name: 'Messages',
        description: 'Messagerie temps réel'
      },
      {
        name: 'Entretiens',
        description: 'Planification des entretiens'
      },
      {
        name: 'Paiements',
        description: 'Gestion des paiements et abonnements'
      },
      {
        name: 'Références',
        description: 'Validation des expériences'
      },
      {
        name: 'Admin',
        description: 'Administration de la plateforme'
      },
      {
        name: 'Documentation',
        description: 'Outils de documentation'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT'
        }
      },
      schemas: {
        // Schémas existants...
        Error: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Une erreur est survenue'
            },
            errors: {
              type: 'object',
              additionalProperties: {
                type: 'string'
              }
            }
          }
        },
        Success: {
          type: 'object',
          required: ['success', 'data'],
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Opération réussie'
            },
            data: {
              type: 'object'
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              example: 100
            },
            page: {
              type: 'integer',
              example: 1
            },
            limit: {
              type: 'integer',
              example: 10
            },
            pages: {
              type: 'integer',
              example: 10
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token d\'authentification manquant ou invalide',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Accès refusé - Droits insuffisants',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Erreur de validation des données',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Erreur serveur interne',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Chemins vers les fichiers de routes et modèles
};

// Génération des spécifications Swagger
const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions: swaggerCustomOptions
};