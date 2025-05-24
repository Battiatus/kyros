/**
 * Middleware d'upload de fichiers
 * @module middlewares/upload
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers si ils n'existent pas
const createDirs = () => {
  const dirs = ['public/uploads/profiles', 'public/uploads/cv', 'public/uploads/companies'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createDirs();

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'public/uploads/';
    
    switch (file.fieldname) {
      case 'photo':
        uploadPath += 'profiles/';
        break;
      case 'cv':
        uploadPath += 'cv/';
        break;
      case 'logo':
        uploadPath += 'companies/';
        break;
      default:
        uploadPath += 'misc/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtres pour les types de fichiers
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    // Images seulement
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  } else if (file.fieldname === 'cv') {
    // PDF et documents
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF et Word sont autorisés'), false);
    }
  } else if (file.fieldname === 'logo') {
    // Images pour logos
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés pour le logo'), false);
    }
  } else {
    cb(null, true);
  }
};

// Configuration multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  }
});

/**
 * Middleware pour upload d'un seul fichier
 * @param {string} fieldName - Nom du champ
 * @returns {Function} Middleware multer
 */
exports.uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Le fichier est trop volumineux (max 5MB)'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Erreur d'upload: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      next();
    });
  };
};

/**
 * Middleware pour upload de plusieurs fichiers
 * @param {string} fieldName - Nom du champ
 * @param {number} maxCount - Nombre maximum de fichiers
 * @returns {Function} Middleware multer
 */
exports.uploadMultiple = (fieldName, maxCount = 5) => {
  return upload.array(fieldName, maxCount);
};

/**
 * Middleware pour upload de fichiers multiples avec noms différents
 * @param {Array} fields - Configuration des champs
 * @returns {Function} Middleware multer
 */
exports.uploadFields = (fields) => {
  return upload.fields(fields);
};