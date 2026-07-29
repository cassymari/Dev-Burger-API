const multer = require('multer');

const multerConfig = {
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(request, file, callback) {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error('Envie uma imagem JPG, PNG ou WebP.'),
      );
    }

    return callback(null, true);
  },
};

module.exports = multerConfig;