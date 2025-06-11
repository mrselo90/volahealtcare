import { z } from 'zod';

// Service validation schema
export const ServiceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  duration: z.string().min(1, 'Duration is required'),
  currency: z.string().default('USD'),
  featured: z.boolean().default(false),
  availability: z.string().default('always'),
  minAge: z.number().int().min(0).max(120).default(18),
  maxAge: z.number().int().min(0).max(120).default(99),
  prerequisites: z.string().optional(),
  aftercare: z.string().optional(),
  benefits: z.string().optional(),
  risks: z.string().optional(),
});

// Service translation schema
export const ServiceTranslationSchema = z.object({
  language: z.string().min(2, 'Language code is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

// Service with translations schema
export const ServiceWithTranslationsSchema = ServiceSchema.extend({
  translations: z.array(ServiceTranslationSchema).min(1, 'At least one translation is required'),
});

// Category validation schema
export const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required'), // JSON string
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  orderIndex: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

// Image validation schema
export const ImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  type: z.enum(['gallery', 'before-after', 'featured']).default('gallery'),
});

// FAQ validation schema
export const FAQSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

// FAQ translation schema
export const FAQTranslationSchema = z.object({
  language: z.string().min(2, 'Language code is required'),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

// Before/After image schema
export const BeforeAfterImageSchema = z.object({
  beforeImage: z.string().url('Invalid before image URL'),
  afterImage: z.string().url('Invalid after image URL'),
  description: z.string().optional(),
});

// Appointment validation schema
export const AppointmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  serviceId: z.string().min(1, 'Service is required'),
  notes: z.string().optional(),
  preferredDate: z.date().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).default('pending'),
});

// Consultation validation schema
export const ConsultationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  message: z.string().min(1, 'Message is required'),
  treatment: z.string().min(1, 'Treatment is required'),
});

// Testimonial validation schema
export const TestimonialSchema = z.object({
  userId: z.string().optional(),
  serviceId: z.string().min(1, 'Service is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  review: z.string().min(1, 'Review is required'),
  country: z.string().min(1, 'Country is required'),
  videoUrl: z.string().url().optional().or(z.literal('')),
  isApproved: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

// Chat message validation schema
export const ChatMessageSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  country: z.string().optional(),
  content: z.string().min(1, 'Message content is required'),
  type: z.enum(['user', 'bot', 'system']).default('user'),
});

// Translation validation schema
export const TranslationSchema = z.object({
  key: z.string().min(1, 'Translation key is required'),
  languageCode: z.string().min(2, 'Language code is required'),
  value: z.string().min(1, 'Translation value is required'),
  category: z.string().default('common'),
});

// API Response schemas
export const ApiSuccessResponseSchema = z.object({
  data: z.any(),
  success: z.literal(true),
  message: z.string().optional(),
});

export const ApiErrorResponseSchema = z.object({
  error: z.string(),
  success: z.literal(false),
  statusCode: z.number().optional(),
  details: z.any().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Query parameters schema
export const ServiceQuerySchema = z.object({
  category: z.string().optional(),
  featured: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  search: z.string().optional(),
}).merge(PaginationSchema);

// Utility function to validate data with proper error handling
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean; 
  data?: T; 
  errors?: string[] 
} => {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const errors = result.error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
  } catch (error) {
    return { 
      success: false, 
      errors: ['Validation failed: ' + (error instanceof Error ? error.message : 'Unknown error')] 
    };
  }
};

// Utility function to validate and transform API request data
export const validateApiRequest = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const validation = validateData(schema, data);
  
  if (!validation.success) {
    throw new Error(`Validation failed: ${validation.errors?.join(', ')}`);
  }
  
  return validation.data!;
}; 