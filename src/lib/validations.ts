import { z } from 'zod';

// Auth validation schemas
export const signInSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" })
});

export const signUpSchema = z.object({
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  fullName: z.string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Full name can only contain letters and spaces" }),
  role: z.enum(['donor', 'hospital', 'ngo', 'admin'], {
    errorMap: () => ({ message: "Please select a valid account type" })
  }),
  hospitalName: z.string()
    .trim()
    .min(2, { message: "Hospital name must be at least 2 characters" })
    .max(200, { message: "Hospital name must be less than 200 characters" })
    .optional(),
  hospitalAddress: z.string()
    .trim()
    .min(10, { message: "Hospital address must be at least 10 characters" })
    .max(500, { message: "Hospital address must be less than 500 characters" })
    .optional()
}).refine((data) => {
  if (data.role === 'hospital') {
    return data.hospitalName && data.hospitalAddress;
  }
  return true;
}, {
  message: "Hospital name and address are required for hospital accounts",
  path: ['hospitalName']
});

// Medical request validation schema
export const medicalRequestSchema = z.object({
  patient_name: z.string()
    .trim()
    .min(2, { message: "Patient name must be at least 2 characters" })
    .max(100, { message: "Patient name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Patient name can only contain letters and spaces" }),
  organ_needed: z.enum(['blood', 'kidney', 'liver', 'heart', 'lung', 'bone_marrow'], {
    errorMap: () => ({ message: "Please select a valid organ/donation type" })
  }),
  blood_type_needed: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    errorMap: () => ({ message: "Please select a valid blood type" })
  }),
  urgency: z.enum(['low', 'medium', 'high', 'critical'], {
    errorMap: () => ({ message: "Please select a valid urgency level" })
  }),
  city: z.string()
    .trim()
    .min(2, { message: "City must be at least 2 characters" })
    .max(100, { message: "City must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "City can only contain letters and spaces" }),
  patient_age: z.number()
    .int({ message: "Age must be a whole number" })
    .min(0, { message: "Age must be at least 0" })
    .max(120, { message: "Age must be less than 120" })
    .optional(),
  description: z.string()
    .trim()
    .max(1000, { message: "Description must be less than 1000 characters" })
    .optional(),
  required_by: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter a valid date" })
    .refine((date) => {
      const today = new Date();
      const requiredDate = new Date(date);
      return requiredDate >= today;
    }, { message: "Required date must be in the future" })
    .optional()
});

// Donor profile validation schema
export const donorProfileSchema = z.object({
  blood_type: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    errorMap: () => ({ message: "Please select a valid blood type" })
  }),
  organ_types: z.array(z.enum(['blood', 'kidney', 'liver', 'heart', 'lung', 'bone_marrow']))
    .min(1, { message: "Please select at least one organ type" }),
  city: z.string()
    .trim()
    .min(2, { message: "City must be at least 2 characters" })
    .max(100, { message: "City must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "City can only contain letters and spaces" }),
  availability: z.boolean(),
  medical_notes: z.string()
    .trim()
    .max(500, { message: "Medical notes must be less than 500 characters" })
    .optional()
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type MedicalRequestFormData = z.infer<typeof medicalRequestSchema>;
export type DonorProfileFormData = z.infer<typeof donorProfileSchema>;