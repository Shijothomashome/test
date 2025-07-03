// swagger/swaggerConfig.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecom API documentation',
      version: '1.0.0',
      description: 'API documentation using Swagger',

      contact: {
        name: 'API Support',
        email: 'support@medico.oxiumev.com',
        url: 'https://medico.oxiumev.com/support'
      },
      termsOfService: 'https://medico.oxiumev.com/terms'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1', // change as per your setup
      },
      {
        url: 'https://medico.oxiumev.com/api/v1', // change as per your setup
      },
    ],
  },
  apis: [
  './src/swagger/path/*.js',
  './src/swagger/path/brand/admin*.js',
  './src/swagger/path/brand/user*.js',
],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
