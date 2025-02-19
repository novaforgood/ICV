import { z } from 'zod'

export const DogSchema = z.object({
    name: z.string(),
    age: z.number(),
    breed: z.string().optional(),
    isGoodBoy: z.boolean().optional(),
})

// Infer TypeScript type from the schema
export type Dog = z.infer<typeof DogSchema>
