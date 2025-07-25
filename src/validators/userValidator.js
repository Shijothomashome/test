// validations/userValidation.ts
import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.object({
    code: z.string().startsWith('+').min(2, "Invalid country code"),
    number: z
      .string()
      .regex(/^\d+$/, { message: "Phone number must contain only digits" })
      .min(7, "Phone number is too short")
      .max(15, "Phone number is too long"),
  }),
});
