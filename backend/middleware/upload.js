const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Enhanced file filter with strict MIME type checking
const fileFilter = (req, file, cb) => {
  // Strictly allowed MIME types (prevents MIME type spoofing)
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'video/mp4',
    'video/webm'
  ];

  // Allowed file extensions
  const allowedExtensions = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|mp4|webm/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  // Check both MIME type and extension
  if (allowedMimeTypes.includes(file.mimetype) && extname) {
    return cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Received: ${file.mimetype}. Only JPEG, PNG, GIF, WEBP, PDF, DOC, DOCX, TXT, MP4, and WEBM files are allowed.`));
  }
};

// Configure multer with enhanced security
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1, // Maximum 1 file per request
    fields: 10, // Maximum 10 fields
    parts: 20 // Maximum 20 parts
  },
  fileFilter: fileFilter
});

// Video upload configuration (for intro videos)
const videoUpload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    const videoMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const videoExtensions = /mp4|webm|mov/;
    const extname = videoExtensions.test(path.extname(file.originalname).toLowerCase());

    if (videoMimeTypes.includes(file.mimetype) && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid video file type. Only MP4, WEBM, and MOV files are allowed.'));
    }
  }
});

module.exports = upload;
module.exports.videoUpload = videoUpload;



