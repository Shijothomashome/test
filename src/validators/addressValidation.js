import { z } from 'zod';

export const addressValidation = z.object({
  emirate: z.string().min(1, "Emirate is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  street: z.string().min(1, "Street is required"),
  building: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional(),
  coordinates: z.object({
    lat: z.number({
      required_error: "Latitude is required",
      invalid_type_error: "Latitude must be a number",
    }),
    lng: z.number({
      required_error: "Longitude is required",
      invalid_type_error: "Longitude must be a number",
    }),
  }),
});
