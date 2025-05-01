const multer = require('multer');

// Wrapper to use multer as a middleware with error handling
function multerErrorHandler(multerUpload) {
  return (req, res, next) => {
    multerUpload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // Specific Multer errors
        let message = 'File upload error.';
        switch (err.code) {
          case 'LIMIT_FILE_COUNT':
            message = 'You can upload up to 5 images only.';
            break;
          case 'LIMIT_FILE_SIZE':
            message = 'Each file must be under 5MB.';
            break;
          case 'LIMIT_UNEXPECTED_FILE':
            message = 'Too many files uploaded or wrong field name.';
            break;
        }
        return res.status(400).json({ err: message });
      } else if (err) {
        // Unknown errors
        return res.status(500).json({ err: 'Something went wrong while uploading files.' });
      }
      next(); 
    });
  };
}

module.exports = multerErrorHandler;
