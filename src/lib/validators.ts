import { z } from "zod";

export const bloodGroups = [
  "A_POS",
  "A_NEG",
  "B_POS",
  "B_NEG",
  "AB_POS",
  "AB_NEG",
  "O_POS",
  "O_NEG",
] as const;

export const availabilityStatuses = ["AVAILABLE", "UNAVAILABLE"] as const;

export const requestStatuses = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
] as const;

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const donorProfileSchema = z.object({
  bloodGroup: z.enum(bloodGroups),
  location: z.string().min(2, "Location is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  availability: z.enum(availabilityStatuses).optional(),
  lastDonationDate: z.string().optional(),
});

export const bloodRequestSchema = z.object({
  bloodGroup: z.enum(bloodGroups),
  units: z.coerce.number().min(1).max(10),
  location: z.string().min(2, "Location is required"),
  neededAt: z.string().min(1, "Needed date is required"),
  note: z.string().max(500).optional(),
  donorId: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    token: z.string().min(1, "Token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
