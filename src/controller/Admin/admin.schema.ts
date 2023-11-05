import z from "zod";

export const CategoryCreationSchema = z.object({
  name: z.string().min(3).max(100),
});

export type CategoryCreationSchemaType = z.infer<typeof CategoryCreationSchema>;

export const IdSchema = z.object({
  id: z.string().uuid(),
});

export type IdSchemaType = z.infer<typeof IdSchema>;

export const CategoryUpdateSchema = IdSchema.extend({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
});

export type CategoryUpdateSchemaType = z.infer<typeof CategoryUpdateSchema>;

export const BookCreationSchema = z.object({
  title: z.string().min(3).max(100),
  date: z.coerce.date(),
  category: z.string().uuid(),
  authorName: z.string().min(3).max(100),
  price: z.number().min(0),
  numberOfCopies: z.number().min(0),
});

export type BookCreationSchemaType = z.infer<typeof BookCreationSchema>;

export const BookUpdateSchema = IdSchema.extend({
  title: z.string().min(3).max(100).optional(),
  date: z.coerce.date().optional(),
  category: z.string().uuid().optional(),
  authorName: z.string().min(3).max(100).optional(),
  price: z.number().min(0).optional(),
});

export type BookUpdateSchemaType = z.infer<typeof BookUpdateSchema>;
