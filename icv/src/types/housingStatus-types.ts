import { z } from 'zod'

export type NewHousing = z.infer<typeof HousingStatusSchema>

export const HousingStatusSchema = z.object({
    clientID: z.string().optional(),
    housingStatus: z.string().optional(),
    date: z.string().optional(),
})