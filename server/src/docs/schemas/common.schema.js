// src/docs/schemas/common.schema.js
module.exports = {
    Error: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    Pagination: {
      type: 'object',
      properties: {
        page: { type: 'integer' },
        limit: { type: 'integer' },
        total: { type: 'integer' },
        pages: { type: 'integer' }
      }
    }
  };