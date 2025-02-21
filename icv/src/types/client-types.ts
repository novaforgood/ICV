import { z } from 'zod'
import { timestampToDateSchema } from './misc-types'

export const Gender = z.enum(['Male', 'Female', 'Other', 'N/A'])
export const Ethnicity = z.enum([
    'African American',
    'Asian',
    'Latino/Hispanic',
    'Native American',
    'White/Caucasian',
    'Other',
    'N/A',
])
export const FosterYouthStatus = z.enum([
    'Yes, Currently',
    'Yes, Previously',
    'No',
    'N/A',
])
export const EmploymentStatus = z.enum([
    'No',
    'Yes, Part-Time',
    'Yes, Full-Time',
    'N/A',
])
export const ProbationStatus = z.enum([
    'No',
    'Yes, Previously',
    'Yes, Currently',
    'N/A',
])
export const ClientStatus = z.enum(['Active', 'Inactive', 'N/A'])
export const OpenClientStatus = z.enum([
    'Yes, Currently',
    'Yes, Previously',
    'No',
    'N/A',
])

export const ClientSchema = z.object({
    id: z.string(),
    // Basic client details
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    middleInitial: z.string().optional(),
    dateOfBirth: timestampToDateSchema.optional(),
    gender: Gender.optional(),
    otherGender: z.string().optional(), // Fallback for "Other"
    age: z.number().optional(),

    // Spouse information
    spouseName: z.string().optional(),
    spouseAge: z.number().optional(),
    spouseGender: Gender.optional(),
    spouseOtherGender: z.string().optional(), // Fallback for "Other"

    // Location and contact details
    address: z.string().optional(),
    aptNumber: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),

    // Program and intake details
    program: z.string().optional(),
    intakeDate: timestampToDateSchema.optional(),
    primaryLanguage: z.string().optional(),
    clientCode: z.string().optional(),

    // Housing and referral details
    housingType: z.string().optional(),
    birthplace: z.string().optional(),
    referralSource: z.string().optional(),

    // Family and demographic details
    familySize: z.number().optional(),
    numberOfChildren: z.number().optional(),
    childrenDetails: z
        .array(
            z.object({
                name: z.string().optional(),
                age: z.number().optional(),
            }),
        )
        .optional(),
    ethnicity: Ethnicity.optional(),

    // Public services information
    publicServices: z.object({
        generalRelief: z.boolean(),
        calFresh: z.boolean(),
        calWorks: z.boolean(),
        ssi: z.boolean(),
        ssa: z.boolean(),
        unemployment: z.boolean(),
    }).optional(),

    // Assessment and client details
    needsAssessment: z.array(z.string()).optional(),
    openClientWithChildFamilyServices: OpenClientStatus.optional(),
    previousArrests: z.boolean().optional(),
    probationStatus: ProbationStatus.optional(),

    // Education and employment
    education: z.object({
        hasHighSchoolDiploma: z.boolean().optional(),
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
    status: ClientStatus.refine(
        (val) => val !== undefined,
        { message: 'Client status is required' }
    ).optional(),

    // Additional notes
    notes: z.string().optional(),
})

export type Gender = z.infer<typeof Gender>
export type Ethnicity = z.infer<typeof Ethnicity>
export type FosterYouthStatus = z.infer<typeof FosterYouthStatus>
export type EmploymentStatus = z.infer<typeof EmploymentStatus>
export type ProbationStatus = z.infer<typeof ProbationStatus>
export type ClientStatus = z.infer<typeof ClientStatus>
export type OpenClientStatus = z.infer<typeof OpenClientStatus>

export type Client = z.infer<typeof ClientSchema>

export const PartialClientSchema = ClientSchema.partial()
export type PartialClient = z.infer<typeof PartialClientSchema>

export const BasicIntakeSchema = ClientSchema.pick({
    assignedClientManager: true,
    // assignedDate: true,
    status: true,
    lastName: true,
    firstName: true,
    middleInitial: true,
    // dateOfBirth: true,
    age: true,
    gender: true,
    otherGender: true,
    phoneNumber: true,
    email: true,
    address: true,
    city: true,
    zipCode: true,
    aptNumber: true,
})

export const DemographicIntakeSchema = ClientSchema.pick({
    // familySize: true,
    // ethnicity: true,
    // publicServices: true,
    spouseName: true,
    // spouseAge: true,
    // spouseGender: true,
    // spouseOtherGender: true,
    // numberOfChildren: true,
    // childrenDetails: true,
})

export const AssessmentIntakeSchema = ClientSchema.pick({
    notes: true,
    // mentalHealthDiagnosis: true,
    // substanceAbuseDetails: true,
    // program: true,
    // intakeDate: true,
    // primaryLanguage: true,
    // clientCode: true,
    // housingType: true,
    // birthplace: true,
    // referralSource: true,
    // needsAssessment: true,
    // openClientWithChildFamilyServices: true,
    // previousArrests: true,
    // probationStatus: true,
    // education: true,
    // employmentStatus: true,
    

})