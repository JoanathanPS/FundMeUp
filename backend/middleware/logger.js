/**
 * Request/Response Logger Middleware
 * Logs all incoming requests and outgoing responses
 */

const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log incoming request
  console.log(`\n📥 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  if (Object.keys(req.body).length > 0) {
    console.log('   Body:', JSON.stringify(req.body, null, 2));
  }
  
  if (Object.keys(req.query).length > 0) {
    console.log('   Query:', req.query);
  }
  
  // Capture the original res.json function
  const originalJson = res.json.bind(res);
  
  // Override res.json to log responses
  res.json = function(data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    const statusEmoji = statusCode < 300 ? '✅' : statusCode < 400 ? '↩️' : '❌';
    
    console.log(`${statusEmoji} [${statusCode}] ${req.method} ${req.path} - ${duration}ms`);
    
    if (statusCode >= 400) {
      console.log('   Error:', data.message || data.error);
    }
    
    return originalJson(data);
  };
  
  next();
};

module.exports = logger;

