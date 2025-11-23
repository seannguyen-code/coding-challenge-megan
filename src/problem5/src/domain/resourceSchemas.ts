import { z } from 'zod';

export const CreateResourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  type: z.string().min(1, 'Type is required').max(100, 'Type too long'),
  status: z.string().max(50).optional().default('active'),
  metadata: z.record(z.unknown()).nullable().optional(),
});

export const UpdateResourceSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    type: z.string().min(1).max(100).optional(),
    status: z.string().max(50).optional(),
    metadata: z.record(z.unknown()).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const ListResourcesQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().min(1).max(100).optional()),
  offset: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().min(0).optional()),
  status: z.string().max(50).optional(),
  type: z.string().max(100).optional(),
});

export const ResourceIdSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().positive('Invalid resource ID')),
});
