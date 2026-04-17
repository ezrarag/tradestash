import { z } from "zod";

import { listingCategories, listingConditions } from "@/lib/constants";

export const listingSchema = z
  .object({
    title: z.string().min(4).max(80),
    description: z.string().min(20).max(500),
    category: z.enum(listingCategories),
    condition: z.enum(listingConditions),
    photos: z.array(z.string().url()).max(4),
    city: z.string().min(2).max(80),
    zipCode: z.string().max(12).optional().or(z.literal("")),
    campus: z.string().max(80).optional().or(z.literal("")),
    lat: z.number().optional(),
    lng: z.number().optional(),
    wantInReturnMode: z.enum(["text", "category"]),
    wantInReturnText: z.string().max(120).optional().or(z.literal("")),
    wantInReturnCategory: z.enum(listingCategories).optional(),
  })
  .superRefine((input, ctx) => {
    if (input.wantInReturnMode === "text" && !input.wantInReturnText) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["wantInReturnText"],
        message: "Tell traders what you want back.",
      });
    }

    if (input.wantInReturnMode === "category" && !input.wantInReturnCategory) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["wantInReturnCategory"],
        message: "Choose a return category.",
      });
    }
  });

export const tradeProposalSchema = z.object({
  offeredListingId: z.string().min(1),
  requestedListingId: z.string().min(1),
});

export const messageSchema = z.object({
  body: z.string().min(1).max(500),
});

export const bootstrapUserSchema = z.object({
  displayName: z.string().min(2).max(60),
  email: z.string().email(),
  city: z.string().min(2).max(80),
  campus: z.string().max(80).optional().or(z.literal("")),
  photoURL: z.string().url().optional().or(z.literal("")),
});

export const reviewSchema = z.object({
  tradeId: z.string().min(1),
  toUserId: z.string().min(1),
  rating: z.enum(["thumbUp", "thumbDown"]),
  note: z.string().min(4).max(180),
});

export const deliveryRequestSchema = z.object({
  tradeId: z.string().min(1),
  pickupLocation: z.string().min(4).max(140),
  dropoffLocation: z.string().min(4).max(140),
  itemDescription: z.string().min(4).max(160),
});
