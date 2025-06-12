import categoryValidatorSchemas from './categoryValidatorSchema.js';
// import brandValidatorSchemas from './brandValidatorSchema.js';
import wishlistItemValidator from './whishlistValidator.js';
export default {
...categoryValidatorSchemas,
// ...brandValidatorSchemas,
...wishlistItemValidator
};