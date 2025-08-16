import { z } from "zod";

const emptyStringToUndefined =(schema) =>
  z.preprocess(
    (val) => (val === "" ? undefined : val),
    schema.optional()
  );

export const createCouponValidator = z.object({
  code: z
    .string({ required_error: `"code" is required`, invalid_type_error: `"code" must be a string` })
    .trim()
    .min(1, `"code" cannot be empty`)
    .transform((val) => val.toUpperCase()),

  description: z
    .string({ invalid_type_error: `"description" must be a string` })
    .trim()
    .optional()
    .or(z.literal("")),

  discountType: z
    .enum(["percentage", "flat"], { invalid_type_error: `"discountType" must be one of [percentage, flat]` })
    .refine((val) => val !== undefined, { message: `"discountType" is required` }),

  discountValue: z
    .number({ required_error: `"discountValue" is required`, invalid_type_error: `"discountValue" must be a number` })
    .positive(`"discountValue" must be a positive number`),

  maxDiscountAmount: emptyStringToUndefined(
    z.number({ invalid_type_error: `"maxDiscountAmount" must be a number` })
      .positive(`"maxDiscountAmount" must be a positive number`)
  ),

  minCartValue: emptyStringToUndefined(
    z.number({ invalid_type_error: `"minCartValue" must be a number` })
      .min(0, `"minCartValue" cannot be negative`)
  ),

  usageLimit: emptyStringToUndefined(
    z.object({
      total: emptyStringToUndefined(
        z.number({ invalid_type_error: `"usageLimit.total" must be a number` })
          .int(`"usageLimit.total" must be an integer`)
          .min(0)
      ),
      perUser: emptyStringToUndefined(
        z.number({ invalid_type_error: `"usageLimit.perUser" must be a number` })
          .int(`"usageLimit.perUser" must be an integer`)
          .min(0)
      ),
    })
  ),

  firstOrderOnly: emptyStringToUndefined(
    z.boolean({ invalid_type_error: `"firstOrderOnly" must be true or false` })
  ),

  validFrom: emptyStringToUndefined(
    z.date({ invalid_type_error: `"validFrom" must be a valid date` })
  ),

  validTill: z
    .date({ invalid_type_error: `"validTill" must be a valid date` })
    .optional()
    .refine((date) => !date || date > new Date(), {
      message: `"validTill" must be a future date`,
    }),

  isActive: emptyStringToUndefined(
    z.boolean({ invalid_type_error: `"isActive" must be true or false` })
  ),

  isDeleted: emptyStringToUndefined(
    z.boolean({ invalid_type_error: `"isDeleted" must be true or false` })
  ),
});
