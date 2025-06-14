// swagger/swaggerConfig.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1', // change as per your setup
      },
      {
        url: 'https://medico.oxiumev.com/api/v1', // change as per your setup
      },
    ],
  },
  apis: ['./src/swagger/path/*.js'], // path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
