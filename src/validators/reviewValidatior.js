// src/validations/review.validation.ts
import { z } from "zod";

// MongoDB ObjectId validator
export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// ---------------------------
// Create Review Schema
// ---------------------------
export const createReviewSchema = z.object({
  body: z.object({
    product: objectId,
    rating: z.number().min(1).max(5),
    title: z.string().trim().max(100).optional(),
    comment: z.string().trim().max(1000).optional(),
    images: z.array(z.string().url("Invalid image URL")).max(6).optional(),
  }).strict(), // reject unknown fields
});

// ---------------------------
// Update Review Schema
// ---------------------------
export const updateReviewSchema = z.object({
  params: z.object({
    id: objectId, // reviewId
  }),
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    title: z.string().trim().max(100).optional(),
    comment: z.string().trim().max(1000).optional(),
    images: z.array(z.string().url("Invalid image URL")).max(6).optional(),
  }).strict(),
});

// ---------------------------
// Admin Moderation Schema
// ---------------------------
export const adminModerateReviewSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.enum(["pending", "approved", "rejected"]),
    verifiedPurchase: z.boolean().optional(),
    helpfulCount: z.number().int().min(0).optional(),
  }).strict(),
});

// ---------------------------
// Query Schema (for listing/filtering reviews)
// ---------------------------
export const listReviewsQuerySchema = z.object({
  product: objectId.optional(),
  user: objectId.optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.enum(["newest", "oldest", "top"]).default("newest"),
}).strict();

// ---------------------------
// Types
// ---------------------------
