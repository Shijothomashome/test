import categoryValidatorSchemas from './categoryValidatorSchemas.js';
import brandValidatorSchemas from './brandValidatorSchemas.js';
import wishlistItemValidator from './whishlistValidator.js';
import couponValidatorSchemas from './couponValidatorSchemas.js';
import offerValidatorSchemas from './offerValidatorSchemas.js';

export default {
  ...categoryValidatorSchemas,
  ...brandValidatorSchemas,
  ...wishlistItemValidator,
  ...couponValidatorSchemas,
  ...offerValidatorSchemas
};
