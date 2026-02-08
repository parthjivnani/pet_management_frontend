import { z } from "zod";

export const speciesSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

export type SpeciesSchemaType = z.infer<typeof speciesSchema>;
