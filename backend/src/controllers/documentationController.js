/**
 * Contrôleur de gestion de la documentation
 * @module controllers/documentationController
 */
const yaml = require('js-yaml');
const { specs } = require('../utils/swagger');
const catchAsync = require('../utils/catchAsync');

/**
 * Télécharger la documentation Swagger en JSON
 * @route GET /api/v1/documentation/download/json
 * @group Documentation - Téléchargement de la documentation API
 * @param {Object} res - Réponse Express
 * @returns {Object} Documentation JSON
 */
exports.downloadSwaggerJSON = catchAsync(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="hereoz-api-documentation.json"');
  res.status(200).json(specs);
});

/**
 * Télécharger la documentation Swagger en YAML
 * @route GET /api/v1/documentation/download/yaml
 * @group Documentation - Téléchargement de la documentation API
 * @param {Object} res - Réponse Express
 * @returns {String} Documentation YAML
 */
exports.downloadSwaggerYAML = catchAsync(async (req, res) => {
  const yamlStr = yaml.dump(specs);
  res.setHeader('Content-Type', 'text/yaml');
  res.setHeader('Content-Disposition', 'attachment; filename="hereoz-api-documentation.yaml"');
  res.status(200).send(yamlStr);
});

/**
 * Télécharger la collection Postman
 * @route GET /api/v1/documentation/download/postman
 * @group Documentation - Téléchargement de la documentation API
 * @param {Object} res - Réponse Express
 * @returns {Object} Collection Postman
 */
exports.downloadPostmanCollection = catchAsync(async (req, res) => {
  const postmanCollection = convertSwaggerToPostman(specs);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="hereoz-api-postman-collection.json"');
  res.status(200).json(postmanCollection);
});

/**
 * Convertir Swagger/OpenAPI en collection Postman
 * @param {Object} swaggerDoc - Documentation Swagger
 * @returns {Object} Collection Postman
 */
function convertSwaggerToPostman(swaggerDoc) {
  const collection = {
    info: {
      name: swaggerDoc.info.title,
      description: swaggerDoc.info.description,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [],
    variable: [
      {
        key: "baseUrl",
        value: swaggerDoc.servers[0].url,
        type: "string"
      },
      {
        key: "token",
        value: "",
        type: "string"
      }
    ]
  };

  // Parcourir toutes les routes
  Object.entries(swaggerDoc.paths).forEach(([path, methods]) => {
    const folder = {
      name: path,
      item: []
    };

    Object.entries(methods).forEach(([method, operation]) => {
      if (method === 'parameters') return;

      const request = {
        name: operation.summary || `${method.toUpperCase()} ${path}`,
        request: {
          method: method.toUpperCase(),
          header: [
            {
              key: "Content-Type",
              value: "application/json",
              type: "text"
            }
          ],
          url: {
            raw: `{{baseUrl}}${path}`,
            host: ["{{baseUrl}}"],
            path: path.split('/').filter(p => p)
          }
        }
      };

      // Ajouter l'authentification si nécessaire
      if (operation.security && operation.security.length > 0) {
        request.request.header.push({
          key: "Authorization",
          value: "Bearer {{token}}",
          type: "text"
        });
      }

      // Ajouter le body si nécessaire
      if (operation.requestBody) {
        const content = operation.requestBody.content['application/json'];
        if (content && content.schema) {
          request.request.body = {
            mode: "raw",
            raw: JSON.stringify(generateExampleFromSchema(content.schema), null, 2),
            options: {
              raw: {
                language: "json"
              }
            }
          };
        }
      }

      folder.item.push(request);
    });

    if (folder.item.length > 0) {
      collection.item.push(folder);
    }
  });

  return collection;
}

/**
 * Générer un exemple à partir d'un schéma
 * @param {Object} schema - Schéma OpenAPI
 * @returns {Object} Exemple généré
 */
function generateExampleFromSchema(schema) {
  if (schema.example) return schema.example;

  switch (schema.type) {
    case 'object':
      const obj = {};
      if (schema.properties) {
        Object.entries(schema.properties).forEach(([key, prop]) => {
          obj[key] = generateExampleFromSchema(prop);
        });
      }
      return obj;
    case 'array':
      return [generateExampleFromSchema(schema.items || {})];
    case 'string':
      if (schema.format === 'email') return 'user@example.com';
      if (schema.format === 'date') return '2025-01-01';
      if (schema.format === 'date-time') return '2025-01-01T00:00:00Z';
      if (schema.enum) return schema.enum[0];
      return 'string';
    case 'number':
    case 'integer':
      return schema.minimum || 0;
    case 'boolean':
      return true;
    default:
      return null;
  }
}