/**
 * Configuration de Swagger pour la documentation API
 * @module utils/swagger
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config/config');

// Options de configuration Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Hereoz',
      version: '1.0.0',
      description: 'Documentation API de la plateforme Hereoz de recrutement en hôtellerie-restauration',
      contact: {
        name: 'Support Hereoz',
        email: 'support@hereoz.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}/`,
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        CreateEntreprise: {
          type: 'object',
          required: ['nom', 'secteur', 'taille'],
          properties: {
            nom: {
              type: 'string',
              description: 'Nom de l\'entreprise'
            },
            domaine_email: {
              type: 'string',
              description: 'Domaine email de l\'entreprise'
            },
            adresse: {
              type: 'string',
              description: 'Adresse physique'
            },
            secteur: {
              type: 'string',
              description: 'Secteur d\'activité'
            },
            taille: {
              type: 'string',
              enum: ['petite', 'moyenne', 'grande'],
              description: 'Taille de l\'entreprise'
            },
            site_web: {
              type: 'string',
              description: 'Site web'
            },
            description: {
              type: 'string',
              description: 'Description de l\'entreprise'
            }
          }
        },
        UpdateEntreprise: {
          type: 'object',
          properties: {
            nom: {
              type: 'string',
              description: 'Nom de l\'entreprise'
            },
            adresse: {
              type: 'string',
              description: 'Adresse physique'
            },
            secteur: {
              type: 'string',
              description: 'Secteur d\'activité'
            },
            taille: {
              type: 'string',
              enum: ['petite', 'moyenne', 'grande'],
              description: 'Taille de l\'entreprise'
            },
            valeurs: {
              type: 'object',
              description: 'Valeurs de l\'entreprise'
            },
            langues: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Langues parlées'
            },
            site_web: {
              type: 'string',
              description: 'Site web'
            },
            reseaux_sociaux: {
              type: 'object',
              description: 'Liens des réseaux sociaux'
            },
            description: {
              type: 'string',
              description: 'Description de l\'entreprise'
            }
          }
        },
        UpdateProfilEntreprise: {
          type: 'object',
          properties: {
            description_complete: {
              type: 'string',
              description: 'Description détaillée'
            },
            ambiance_travail: {
              type: 'string',
              description: 'Description de l\'ambiance'
            },
            avantages: {
              type: 'object',
              description: 'Avantages offerts'
            },
            valeurs_entreprise: {
              type: 'object',
              description: 'Valeurs détaillées'
            }
          }
        },
        CreateOffre: {
          type: 'object',
          required: ['titre', 'description', 'date_expiration', 'localisation', 'type_contrat'],
          properties: {
            titre: {
              type: 'string',
              description: 'Titre du poste'
            },
            description: {
              type: 'string',
              description: 'Description détaillée'
            },
            salaire_min: {
              type: 'number',
              description: 'Salaire minimum'
            },
            salaire_max: {
              type: 'number',
              description: 'Salaire maximum'
            },
            date_expiration: {
              type: 'string',
              format: 'date',
              description: 'Date d\'expiration'
            },
            date_embauche_souhaitee: {
              type: 'string',
              format: 'date',
              description: 'Date d\'embauche souhaitée'
            },
            localisation: {
              type: 'string',
              description: 'Localisation du poste'
            },
            type_contrat: {
              type: 'string',
              enum: ['cdi', 'cdd', 'stage', 'freelance', 'autre'],
              description: 'Type de contrat'
            },
            remote: {
              type: 'string',
              enum: ['non', 'hybride', 'full_remote'],
              description: 'Possibilité de télétravail'
            },
            horaires: {
              type: 'string',
              description: 'Horaires de travail'
            },
            tags_competences: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Compétences requises'
            },
            langues_requises: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Langues requises'
            },
            experience_requise: {
              type: 'number',
              description: 'Expérience requise en années'
            },
            entretien_ia_auto: {
              type: 'boolean',
              description: 'Activer l\'entretien IA'
            },
            urgence: {
              type: 'boolean',
              description: 'Recrutement urgent'
            }
          }
        },
        UpdateOffre: {
          type: 'object',
          properties: {
            titre: {
              type: 'string',
              description: 'Titre du poste'
            },
            description: {
              type: 'string',
              description: 'Description détaillée'
            },
            salaire_min: {
              type: 'number',
              description: 'Salaire minimum'
            },
            salaire_max: {
              type: 'number',
              description: 'Salaire maximum'
            },
            date_expiration: {
              type: 'string',
              format: 'date',
              description: 'Date d\'expiration'
            },
            date_embauche_souhaitee: {
              type: 'string',
              format: 'date',
              description: 'Date d\'embauche souhaitée'
            },
            localisation: {
              type: 'string',
              description: 'Localisation du poste'
            },
            type_contrat: {
              type: 'string',
              enum: ['cdi', 'cdd', 'stage', 'freelance', 'autre'],
              description: 'Type de contrat'
            },
            remote: {
              type: 'string',
              enum: ['non', 'hybride', 'full_remote'],
              description: 'Possibilité de télétravail'
            },
            horaires: {
              type: 'string',
              description: 'Horaires de travail'
            },
            tags_competences: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Compétences requises'
            },
            langues_requises: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Langues requises'
            },
            experience_requise: {
              type: 'number',
              description: 'Expérience requise en années'
            },
            entretien_ia_auto: {
              type: 'boolean',
              description: 'Activer l\'entretien IA'
            },
            urgence: {
              type: 'boolean',
              description: 'Recrutement urgent'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // Chemins vers les fichiers de routes
};

// Génération des spécifications Swagger
const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};

/**
 * Fonction pour générer la documentation Swagger
 * Peut être utilisée via npm run swagger-autogen
 */
if (require.main === module) {
  const swaggerAutogen = require('swagger-autogen')();
  
  const outputFile = './swagger-output.json';
  const endpointsFiles = ['./src/routes/*.js'];
  
  swaggerAutogen(outputFile, endpointsFiles, options.definition)
    .then(() => {
      console.log('Documentation Swagger générée avec succès!');
    })
    .catch((err) => {
      console.error('Erreur lors de la génération de la documentation Swagger:', err);
    });
}