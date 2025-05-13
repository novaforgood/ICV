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

export const ContactType = z.enum([
    'Referral and Intake', // ReferralAndIntake
    'Phone', // Phone
    'Face to Face', // FaceToFace
    'Team Meeting', // TeamMeeting
    'Individual Meeting', // IndividualMeeting
    'Family Meeting', // FamilyMeeting
    'Referral to Service Provider', // ReferralToServiceProvider
    'Emplyment Job Readiness', // EmploymentJobReadiness and EventActivityFieldTrip
    'Transportation', // Transportation
    'Tracking Check Up', // TrackingCheckUp
    'Advocacy', // Advocacy
    'Wellness Check', // WellnessCheck
    'Other', // Other
])

// CaseEvent schema
export const CheckInSchema = z.object({
    // change string date (chosen from form input) to date, then check validity
    startTime: z.string(),
    endTime: z.string().optional(),
    // check if chosen dropdown is a string of the ContactType array (form input passed as)
    category: z.enum(Object.values(CheckInCategory.Values) as [string, ...string[]], {
        message: "Choose check-in category."
    }).optional(),
    description: z.string().optional(),
    name : z.string().optional(),
    location: z.string().optional(),
    asigneeId: z.string().optional(),
    id: z.string().optional(),
    scheduled: z.boolean(),
    caseNotes: z.string().optional(),
    contactCode: z.enum(Object.values(ContactType.Values) as [string, ...string[]], {
        message: "Choose contact code."
    }).optional(),
    clientDocId: z.string().optional(),
    clientName: z.string().optional(),
    cliendId: z.string().optional(),
})
.passthrough(); // lets fields not in schema pass through (clientId, because always collected properly)

// Types for enums and main schema
export type CheckInType = z.infer<typeof CheckInSchema>
export type CheckInCategoryType = z.infer<typeof CheckInCategory>;
