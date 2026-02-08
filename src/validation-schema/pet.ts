import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  species: z.string().min(1, "Species is required").max(50),
  breed: z.string().min(1, "Breed is required").max(50),
  age: z.coerce.number().min(0, "Age must be 0 or more"),
  description: z.string().max(1000).optional(),
  status: z.enum(["available", "adopted"]).optional(),
});

export type PetSchemaType = z.infer<typeof petSchema>;
