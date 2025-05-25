/**
 * Routes de documentation
 * @module routes/documentationRoutes
 */
const express = require('express');
const router = express.Router();
const documentationController = require('../controllers/documentationController');

/**
 * @swagger
 * /documentation/download/json:
 *   get:
 *     summary: Télécharger la documentation API en JSON
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Documentation JSON
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/download/json', documentationController.downloadSwaggerJSON);

/**
 * @swagger
 * /documentation/download/yaml:
 *   get:
 *     summary: Télécharger la documentation API en YAML
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Documentation YAML
 *         content:
 *           text/yaml:
 *             schema:
 *               type: string
 */
router.get('/download/yaml', documentationController.downloadSwaggerYAML);

/**
 * @swagger
 * /documentation/download/postman:
 *   get:
 *     summary: Télécharger la collection Postman
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Collection Postman
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/download/postman', documentationController.downloadPostmanCollection);

module.exports = router;