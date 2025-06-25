import userValidatorSchemas from './userValidatorSchemas.js';
import categoryValidatorSchemas from './categoryValidatorSchemas.js';
import brandValidatorSchemas from './brandValidatorSchemas.js';
import wishlistItemValidator from './whishlistValidator.js';
import couponValidatorSchemas from './couponValidatorSchemas.js';

export default {
  ...userValidatorSchemas,
  ...categoryValidatorSchemas,
  ...brandValidatorSchemas,
  ...wishlistItemValidator,
  ...couponValidatorSchemas,
};
