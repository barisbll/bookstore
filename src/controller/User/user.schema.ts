import z from "zod";

export const AddToCartSchema = z.object({
  userId: z.string().uuid(),
  bookId: z.string().uuid(),
});

export type AddToCartSchemaType = z.infer<typeof AddToCartSchema>;
