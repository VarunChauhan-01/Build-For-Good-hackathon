/**
 * Centralized Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

// 404 handler
function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
}

module.exports = { errorHandler, notFoundHandler };
