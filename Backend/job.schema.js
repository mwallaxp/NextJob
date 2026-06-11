import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createJobSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Job title is required" }).min(3).max(100),
    description: z.string({ required_error: "Job description is required" }).min(20),
    requirements: z.array(z.string()).min(1, "At least one requirement is required"),
    salary: z.coerce.number({ 
      required_error: "Salary is required",
      invalid_type_error: "Salary must be a number" 
    }).positive(),
    location: z.string({ required_error: "Location is required" }),
    jobType: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship"], {
      required_error: "Job type is required"
    }),
    experienceLevel: z.coerce.number().int().nonnegative("Experience cannot be negative"),
    currency: z.enum(["USD", "NGN", "EUR", "GBP"], {
      required_error: "Currency is required"
    }).default("USD"), // Default to USD, but allow others
    position: z.coerce.number().int().positive("Must have at least 1 position"),
    companyId: z.string({ required_error: "Company ID is required" }),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
  }),
  file: z.any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional()
});

export const getJobByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Job ID is required")
  })
});