// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.type === 'ValidationError') {
      return res.status(400).json({
        error: err.message
      });
    }
  
    if (err.type === 'AuthError') {
      return res.status(401).json({
        error: err.message
      });
    }
  
    return res.status(500).json({
      error: 'Internal server error'
    });
  };

  module.exports = errorHandler;