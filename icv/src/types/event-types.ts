import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'
import { timestampToDateSchema } from './misc-types';

// Enum for contact types
export const CheckInCategory = z.enum([
    'Hot Meal',
    'Hygiene Kit',
    'Snack Pack',
    'Other'
])

// CaseEvent schema
export const ScheduledCheckInSchema = z.object({
    // change string date (chosen from form input) to date, then check validity
    startTime: timestampToDateSchema,
    endTime: timestampToDateSchema,
    // check if chosen dropdown is a string of the ContactType array (form input passed as)
    category: z.enum(Object.values(CheckInCategory.Values) as [string, ...string[]], {
        message: "Choose check-in category."
    }).optional(),
    description: z.string().optional(),
    name : z.string(),
    location: z.string().optional(),
    asigneeId: z.string().optional(),
    clientId: z.string().optional(),
    id: z.string().optional(),

})
.passthrough(); // lets fields not in schema pass through (clientId, because always collected properly)

// Types for enums and main schema
export type ScheduledCheckInType = z.infer<typeof ScheduledCheckInSchema>
export type CheckInCategoryType = z.infer<typeof CheckInCategory>;
