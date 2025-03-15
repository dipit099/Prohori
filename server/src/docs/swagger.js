// src/docs/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const userSchemas = require('./schemas/user.schema');
const crimeSchemas = require('./schemas/crime.schema');
const commonSchemas = require('./schemas/common.schema');
const postSchemas = require('./schemas/posts.schema');
const emergencyContactSchemas = require('./schemas/emergency-contact.schema');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crime Reporting API',
      version: '1.0.0',
      description: 'API documentation for Crime Reporting Platform'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }, 
      
      {
        
        url: 'http://prohori.eu-north-1.elasticbeanstalk.com/api',
        description: 'Production server'
      }
      
    ],
    components: {
      schemas: {
        ...userSchemas,
        ...crimeSchemas,
        ...commonSchemas,
        ...postSchemas,
        ...emergencyContactSchemas
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
