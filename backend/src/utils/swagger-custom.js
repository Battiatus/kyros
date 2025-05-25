/**
 * Configuration personnalisée de Swagger UI
 * @module utils/swagger-custom
 */

// CSS personnalisé pour Swagger UI
const customCss = `
  /* Thème principal Hereoz */
  .swagger-ui .topbar { 
    display: none; 
  }

  /* Header personnalisé */
  .swagger-ui .info {
    margin-bottom: 50px;
  }

  .swagger-ui .info .title {
    font-size: 2.5rem;
    color: #6366F1;
    font-weight: 700;
  }

  .swagger-ui .info .description {
    font-size: 1.1rem;
    color: #4B5563;
    line-height: 1.6;
  }

  /* Boutons */
  .swagger-ui .btn {
    border-radius: 8px;
    font-weight: 500;
  }

  .swagger-ui .btn.authorize {
    background-color: #6366F1;
    border-color: #6366F1;
  }

  .swagger-ui .btn.authorize:hover {
    background-color: #4F46E5;
    border-color: #4F46E5;
  }

  .swagger-ui .btn.execute {
    background-color: #10B981;
    border-color: #10B981;
  }

  .swagger-ui .btn.execute:hover {
    background-color: #059669;
    border-color: #059669;
  }

  /* Tags */
  .swagger-ui .opblock-tag {
    border-bottom: 2px solid #E5E7EB;
    padding: 20px 0;
  }

  .swagger-ui .opblock-tag-section h4 {
    color: #1F2937;
    font-weight: 600;
  }

  /* Opérations */
  .swagger-ui .opblock {
    border-radius: 8px;
    border: 1px solid #E5E7EB;
    margin-bottom: 15px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: #10B981;
  }

  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: #3B82F6;
  }

  .swagger-ui .opblock.opblock-put .opblock-summary-method {
    background: #F59E0B;
  }

  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background: #EF4444;
  }

  .swagger-ui .opblock-summary-description {
    color: #4B5563;
    font-weight: 500;
  }

  /* Schémas */
  .swagger-ui .model-box {
    border-radius: 8px;
  }

  .swagger-ui section.models {
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 20px;
    margin-top: 40px;
  }

  .swagger-ui section.models h4 {
    color: #6366F1;
    font-weight: 600;
    margin-bottom: 20px;
  }

  /* Réponses */
  .swagger-ui .responses-wrapper .response {
    border-radius: 8px;
  }

  .swagger-ui table tbody tr td {
    border-bottom: 1px solid #E5E7EB;
  }

  /* Scrollbar personnalisée */
  .swagger-ui ::-webkit-scrollbar {
    width: 8px;
  }

  .swagger-ui ::-webkit-scrollbar-track {
    background: #F3F4F6;
  }

  .swagger-ui ::-webkit-scrollbar-thumb {
    background: #9CA3AF;
    border-radius: 4px;
  }

  .swagger-ui ::-webkit-scrollbar-thumb:hover {
    background: #6B7280;
  }

  /* Header fixe personnalisé */
  .hereoz-header {
    background-color: white;
    border-bottom: 1px solid #E5E7EB;
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .hereoz-header .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hereoz-header .logo img {
    height: 40px;
    width: auto;
  }

  .hereoz-header .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: #6366F1;
  }

  .hereoz-header .actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .hereoz-header .btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hereoz-header .btn-primary {
    background-color: #6366F1;
    color: white;
  }

  .hereoz-header .btn-primary:hover {
    background-color: #4F46E5;
  }

  .hereoz-header .btn-secondary {
    background-color: #F3F4F6;
    color: #4B5563;
  }

  .hereoz-header .btn-secondary:hover {
    background-color: #E5E7EB;
  }

  .hereoz-header .version {
    background-color: #F3F4F6;
    color: #6B7280;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Footer personnalisé */
  .hereoz-footer {
    background-color: #F9FAFB;
    border-top: 1px solid #E5E7EB;
    padding: 2rem;
    text-align: center;
    margin-top: 4rem;
  }

  .hereoz-footer .footer-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .hereoz-footer .links {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  .hereoz-footer .links a {
    color: #6B7280;
    text-decoration: none;
    transition: color 0.2s;
  }

  .hereoz-footer .links a:hover {
    color: #6366F1;
  }

  .hereoz-footer .copyright {
    color: #9CA3AF;
    font-size: 0.875rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hereoz-header {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .hereoz-header .actions {
      width: 100%;
      justify-content: center;
    }

    .hereoz-footer .links {
      flex-direction: column;
      gap: 1rem;
    }
  }
`;

// JavaScript personnalisé pour Swagger UI
const customScript = `
  // Ajouter le header personnalisé
  const header = document.createElement('div');
  header.className = 'hereoz-header';
  header.innerHTML = \`
    <div class="logo">
      <img src="/logo.png" alt="Hereoz" onerror="this.style.display='none'">
      <div class="logo-text">Hereoz API</div>
      <div class="version">v1.0.0</div>
    </div>
    <div class="actions">
      <button class="btn btn-secondary" onclick="downloadDocumentation('json')">
        📥 Télécharger JSON
      </button>
      <button class="btn btn-secondary" onclick="downloadDocumentation('yaml')">
        📥 Télécharger YAML
      </button>
      <button class="btn btn-secondary" onclick="downloadDocumentation('postman')">
        📥 Collection Postman
      </button>
      <a href="/" class="btn btn-primary">
        🏠 Retour à l'accueil
      </a>
    </div>
  \`;
  document.body.insertBefore(header, document.body.firstChild);

  // Ajouter le footer personnalisé
  const footer = document.createElement('div');
  footer.className = 'hereoz-footer';
  footer.innerHTML = \`
    <div class="footer-content">
      <div class="links">
        <a href="https://github.com/hereoz" target="_blank">GitHub</a>
        <a href="/documentation" target="_blank">Documentation Web</a>
        <a href="mailto:support@hereoz.com">Support</a>
        <a href="/terms">Conditions d'utilisation</a>
      </div>
      <div class="copyright">
        © 2025 Hereoz. Tous droits réservés. | Plateforme de recrutement en hôtellerie-restauration
      </div>
    </div>
  \`;
  document.body.appendChild(footer);

  // Fonction de téléchargement
  function downloadDocumentation(format) {
    window.location.href = '/api/v1/documentation/download/' + format;
  }

  // Personnaliser le comportement de l'UI
  window.onload = function() {
    // Ajouter des descriptions aux tags
    const tagDescriptions = {
      'Auth': '🔐 Authentification et gestion des sessions utilisateurs',
      'Profils': '👤 Gestion des profils candidats et recruteurs',
      'Offres': '💼 Création et gestion des offres d\'emploi',
      'Candidatures': '📋 Gestion des candidatures et système de matching',
      'Entreprises': '🏢 Gestion des profils entreprises',
      'Messages': '💬 Système de messagerie temps réel',
      'Entretiens': '🤝 Planification et gestion des entretiens',
      'Paiements': '💳 Gestion des paiements et abonnements',
      'Références': '✅ Validation des expériences par référents',
      'Admin': '⚙️ Administration de la plateforme',
      'Documentation': '📚 Téléchargement de la documentation'
    };

    // Attendre que Swagger UI soit chargé
    setTimeout(() => {
      // Ajouter les descriptions aux tags
      document.querySelectorAll('.opblock-tag').forEach(tag => {
        const tagName = tag.getAttribute('data-tag');
        if (tagDescriptions[tagName]) {
          const description = document.createElement('div');
          description.style.cssText = 'color: #6B7280; font-size: 0.9rem; margin-top: 0.5rem;';
          description.textContent = tagDescriptions[tagName];
          tag.querySelector('h4').appendChild(description);
        }
      });

      // Ajouter des icônes aux méthodes
      document.querySelectorAll('.opblock-summary-method').forEach(method => {
        const text = method.textContent.trim().toUpperCase();
        const icons = {
          'GET': '🔍',
          'POST': '➕',
          'PUT': '✏️',
          'DELETE': '🗑️',
          'PATCH': '🔧'
        };
        if (icons[text]) {
          method.textContent = icons[text] + ' ' + text;
        }
      });
    }, 1000);
  };
`;

// Options de configuration pour Swagger UI
const swaggerOptions = {
  customCss,
  customJs: customScript,
  customSiteTitle: "Hereoz API Documentation",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
    persistAuthorization: true,
    displayRequestDuration: true,
    deepLinking: true,
    showExtensions: true,
    showCommonExtensions: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    displayOperationId: false,
    requestInterceptor: (request) => {
      // Ajouter un intercepteur pour logger les requêtes
      console.log('API Request:', request);
      return request;
    },
    responseInterceptor: (response) => {
      // Ajouter un intercepteur pour logger les réponses
      console.log('API Response:', response);
      return response;
    }
  }
};

module.exports = swaggerOptions;