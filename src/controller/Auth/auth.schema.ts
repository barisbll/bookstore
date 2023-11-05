import z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
