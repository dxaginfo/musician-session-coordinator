const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });
  
  // Handle different types of errors
  
  // Validation errors from Objection.js
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.data
    });
  }
  
  // Database constraint errors
  if (err.name === 'DBError') {
    return res.status(400).json({
      message: 'Database error',
      error: err.message
    });
  }
  
  // Not found errors
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      message: 'Resource not found',
      error: err.message
    });
  }
  
  // Knex-specific errors
  if (err.code === '23505') { // Unique violation in PostgreSQL
    return res.status(409).json({
      message: 'Conflict with existing data',
      error: err.detail || err.message
    });
  }
  
  // Authentication and authorization errors
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Authentication error',
      error: err.message
    });
  }
  
  // For SyntaxError (e.g., malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid request body',
      error: 'Malformed JSON'
    });
  }
  
  // Default error handler
  const statusCode = err.statusCode || 500;
  
  // Don't expose internal server errors to client in production
  const errorMessage = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message;
  
  res.status(statusCode).json({
    message: errorMessage,
    ...(process.env.NODE_ENV !== 'production' && statusCode === 500 ? { stack: err.stack } : {})
  });
};