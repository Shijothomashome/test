// Middleware to validate request data using Joi schema
  const validatorMiddleware = (schema) => {
    return (req, res, next) => {
      const data = req.method === 'GET' ? req.query : req.body || {};      
      const { error } = schema.validate(data, { abortEarly: false });
  
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map((d) => d.message),
        });
      }
  
      next();
    };
  };
  
export default  validatorMiddleware;
  