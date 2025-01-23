import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'

// Enum for contact types
export const ContactType = z.enum([
    'RI', // ReferralAndIntake
    'P', // Phone
    'F', // FaceToFace
    'TM', // TeamMeeting
    'IM', // IndividualMeeting
    'FM', // FamilyMeeting
    'R', // ReferralToServiceProvider
    'E', // EmploymentJobReadiness and EventActivityFieldTrip
    'T', // Transportation
    'TC', // TrackingCheckUp
    'A', // Advocacy
    'O', // Other
])

// CaseEvent schema
export const CaseEventSchema = z.object({
    caseId: z.string(),
    date: z.instanceof(Timestamp),
    contactTypes: z.array(ContactType),
    description: z.string().optional(),
})

// Types for enums and main schema
export type ContactTypeType = z.infer<typeof ContactType>
export type CaseEventType = z.infer<typeof CaseEventSchema>
