/**
 * Schema Validation Middleware
 * Sanitizes and validates input to prevent XSS and injection attacks
 */

/**
 * Sanitize input middleware
 * Removes potentially dangerous characters from user input
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize request query
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitize request params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  
  return sanitized;
}

/**
 * Sanitize a string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str;
  }
  
  return str
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers like onclick=
}

module.exports = { sanitizeInput };

