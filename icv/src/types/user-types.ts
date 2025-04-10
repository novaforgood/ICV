import { z } from 'zod'

export type Users = z.infer<typeof UserSchema>

export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email()
})

