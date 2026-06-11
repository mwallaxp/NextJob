import { z } from 'zod';

export const frontendJobSchema = z.object({
  title: z.string({ required_error: "Job title is required" }).min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  description: z.string({ required_error: "Job description is required" }).min(20, "Description must be at least 20 characters"),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  salary: z.coerce.number({ 
    required_error: "Salary is required",
    invalid_type_error: "Salary must be a number" 
  }).positive("Salary must be a positive number"),
  location: z.string({ required_error: "Location is required" }).min(1, "Location is required"),
  jobType: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship"], {
    required_error: "Job type is required",
    errorMap: () => ({ message: "Please select a valid job type" })
  }),
  experienceLevel: z.coerce.number({ invalid_type_error: "Experience must be a number" }).int().nonnegative("Experience cannot be negative").min(0, "Experience cannot be negative"),
  currency: z.enum(["USD", "NGN", "EUR", "GBP"], { required_error: "Currency is required" }),
  position: z.coerce.number({ invalid_type_error: "Positions must be a number" }).int().positive("Must have at least 1 position"),
  companyId: z.string({ required_error: "Company ID is required" }).min(1, "Company ID is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

// Schemas for individual steps
export const jobDetailsStepSchema = frontendJobSchema.pick({
  title: true, description: true, requirements: true, salary: true, currency: true,
  location: true, jobType: true, experienceLevel: true, position: true, skills: true,
});

export const companyDetailsStepSchema = frontendJobSchema.pick({
  companyId: true,
});