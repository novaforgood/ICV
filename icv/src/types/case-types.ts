import { z } from 'zod'
import { timestampToDateSchema } from './misc-types'

export const Gender = z.enum(['Male', 'Female', 'Other'])
export const Ethnicity = z.enum([
    'African American',
    'Asian',
    'Latino/Hispanic',
    'Native American',
    'White/Caucasian',
    'Other',
])
export const FosterYouthStatus = z.enum([
    'Yes, Currently',
    'Yes, Previously',
    'No',
])
export const EmploymentStatus = z.enum([
    'No',
    'Yes, Part-Time',
    'Yes, Full-Time',
])
export const ProbationStatus = z.enum([
    'No',
    'Yes, Previously',
    'Yes, Currently',
])
export const ClientStatus = z.enum(['Active', 'Inactive'])
export const OpenClientStatus = z.enum([
    'Yes, Currently',
    'Yes, Previously',
    'No',
])

export const ClientSchema = z.object({
    id: z.string(),
    // Basic client details
    lastName: z.string(),
    firstName: z.string(),
    middleInitial: z.string().optional(),
    dateOfBirth: timestampToDateSchema,
    gender: Gender,
    otherGender: z.string().optional(), // Fallback for "Other"
    age: z.number(),

    // Spouse information
    spouseName: z.string().optional(),
    spouseAge: z.number().optional(),
    spouseGender: Gender.optional(),
    spouseOtherGender: z.string().optional(), // Fallback for "Other"

    // Location and contact details
    address: z.string().optional(),
    aptNumber: z.string().optional(),
    city: z.string(),
    zipCode: z.string(),
    phoneNumber: z.string(),
    email: z.string().email().optional(),

    // Program and intake details
    program: z.string(),
    intakeDate: timestampToDateSchema,
    primaryLanguage: z.string().optional(),
    clientCode: z.string(),

    // Housing and referral details
    housingType: z.string().optional(),
    birthplace: z.string().optional(),
    referralSource: z.string().optional(),

    // Family and demographic details
    familySize: z.number(),
    numberOfChildren: z.number(),
    childrenDetails: z
        .array(
            z.object({
                name: z.string(),
                age: z.number(),
            }),
        )
        .optional(),
    ethnicity: Ethnicity,

    // Public services information
    publicServices: z.object({
        generalRelief: z.boolean(),
        calFresh: z.boolean(),
        calWorks: z.boolean(),
        ssi: z.boolean(),
        ssa: z.boolean(),
        unemployment: z.boolean(),
    }),

    // Assessment and client details
    needsAssessment: z.array(z.string()).optional(),
    openClientWithChildFamilyServices: OpenClientStatus.optional(),
    previousArrests: z.boolean().optional(),
    probationStatus: ProbationStatus.optional(),

    // Education and employment
    education: z.object({
        hasHighSchoolDiploma: z.boolean(),
        fosterYouthStatus: FosterYouthStatus.optional(),
    }),
    employmentStatus: EmploymentStatus.optional(),

    // Medical and mental health information
    substanceAbuseDetails: z.string().optional(),
    medicalConditions: z.array(z.string()).optional(),
    mentalHealthDiagnosis: z.array(z.string()).optional(),

    // Client management
    assignedClientManager: z.string().optional(),
    assignedDate: timestampToDateSchema.optional(),
    status: ClientStatus,

    // Additional notes
    notes: z.string().optional(),
})

export type GenderType = z.infer<typeof Gender>
export type EthnicityType = z.infer<typeof Ethnicity>
export type FosterYouthStatusType = z.infer<typeof FosterYouthStatus>
export type EmploymentStatusType = z.infer<typeof EmploymentStatus>
export type ProbationStatusType = z.infer<typeof ProbationStatus>
export type ClientStatusType = z.infer<typeof ClientStatus>
export type OpenClientStatusType = z.infer<typeof OpenClientStatus>

export type ClientType = z.infer<typeof ClientSchema>
