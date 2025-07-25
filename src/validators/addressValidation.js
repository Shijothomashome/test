import { z } from "zod";

export const addressValidationSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(1),

  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),

  pincode: z
    .string({ required_error: "Pincode is required" })
    .trim()
    .regex(/^\d{6}$/, "Pincode must be a 6-digit number"),

  house: z
    .string({ required_error: "House/flat info is required" })
    .trim()
    .min(1),

  street: z
    .string({ required_error: "Street is required" })
    .trim()
    .min(1),

  landmark: z
    .string()
    .trim()
    .optional(),

  city: z
    .string({ required_error: "City is required" })
    .trim()
    .min(1),

  state: z
    .string({ required_error: "State is required" })
    .trim()
    .min(1),

  country: z
    .string()
    .trim()
    .default("India"),

  isDefault: z
    .boolean()
    .default(false),

  type: z
    .enum(["Home", "Work", "Address1",'Address2'])
    .default("Home"),
});
