import { Timestamp } from 'firebase/firestore'
import { z } from 'zod'
import { timestampToDateSchema } from './misc-types';

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
    // change string date (chosen from form input) to date, then check validity
    startTime: timestampToDateSchema,
    endTime: timestampToDateSchema,
    // check if chosen dropdown is a string of the ContactType array (form input passed as)
    contactType: z.enum(Object.values(ContactType.Values) as [string, ...string[]], {
        message: "Choose a contact type."
    }).optional(),
    description: z.string().optional(),
    name : z.string(),
    location: z.string().optional(),
    duration: z.number().optional(),
    asigneeId: z.string().optional(),
    id: z.string().optional(),
    clientId: z.string().optional(),

})
.passthrough(); // lets fields not in schema pass through (clientId, because always collected properly)

// Types for enums and main schema
export type ContactTypeType = z.infer<typeof ContactType>
export type CaseEventType = z.infer<typeof CaseEventSchema>
