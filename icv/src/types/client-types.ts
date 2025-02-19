import { date, z } from 'zod'
import { timestampToDateSchema } from './misc-types'

export const Gender = z.enum(['Male', 'Female', 'Other', 'N/A'])
export const Ethnicity = z.enum([
    'White',
    'Black or African American',
    'Hispanic, Latino, or Spanish Origin',
    'Asian',
    'Native American',
    'Middle Eastern',
    'Hawaiian or Pacific Islander',
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
export type NewClient = z.infer<typeof ClientIntakeSchema>

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

export const ClientIntakeSchema = z.object({
    // ----- PAGE 1: Basic intake information -----
    // Intake Information
    // programInfo
    // staffInfo
    // dateInfo

    // Client Profile
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.date().optional(),
    gender: Gender.optional(),
    age: z.number().optional(),
    clientNumber: z.string().optional(),

    // Address
    housingType: z.string().optional(),
    atRisk: z.boolean().optional(),
    streetAddress: z.string().optional(),
    aptNumber: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),

    // Contact Information
    email: z.string().optional(),
    areaCode: z.string().optional(),
    phoneNumber: z.string().optional(),

    // ----- PAGE 2: Family Information -----
    familySize: z.number().optional(),
    spouse: z.object({
        hasSpouse: z.enum(['Yes', 'No']).optional(),
        name: z.string().optional(),
        dateOfBirth: z.date().optional(),
        age: z.number().optional(),
    }).optional(),

    hasChildren: z.enum(['Yes', 'No']).optional(),
    children: z.array(
        z.object({
            name: z.string().optional(),
            dateOfBirth: z.date().optional(),
            age: z.number().optional(),
        }),
    ).optional(),

    pets: z.object({
        hasPets: z.enum(['Yes', 'No']).optional(),
        numberOfPets: z.number().optional(),
    }),

    // ----- PAGE 3: Background Information -----
    ethnicity: z.array(z.string()).optional(),
    mentalHealth: z.string().optional(),
    disabilities: z.string().optional(),
    substanceAbuse: z.string().optional(),
    sexualOffenses: z.string().optional(),

    publicServices: z.array(z.string()).optional(),

    // ----- PAGE 4: Services -----
    // Mentoring
    mentoring: z.object({
        problemSolving: z.boolean().optional(),
        goalSetting: z.boolean().optional(),
        academic: z.boolean().optional(),
        groupMentoring: z.boolean().optional(),
        conflictRes: z.boolean().optional(),
        rumorControl: z.boolean().optional(),
    }).optional(),

    // Personal Development
    personalDev: z.object({
        jobReady: z.boolean().optional(),
        employAssist: z.boolean().optional(),
        careerDev: z.boolean().optional(),
        creativity: z.boolean().optional(),
    }).optional(),

    // Housing Assistance
    housingAssistance: z.object({
        assistShelter: z.boolean().optional(),
        hotel: z.boolean().optional(),
        sharedLiving: z.boolean().optional(),
        management: z.boolean().optional(),
        transport: z.boolean().optional(),
    }).optional(),

    // Redirection Program
    redirection: z.object({
        redirShelter: z.boolean().optional(),
        humanTraffic: z.boolean().optional(),
        personalDev: z.boolean().optional(),
        domesticViolence: z.boolean().optional(),
        informalCase: z.boolean().optional(),
    }).optional(),

    // Education & Training Support
    education: z.object({
        independent: z.boolean().optional(),
        charter: z.boolean().optional(),
        ged: z.boolean().optional(),
        vocational: z.boolean().optional(),
        financialAid: z.boolean().optional(),
    }).optional(),

    // Health & Wellness Support
    healthWellness: z.object({
        mentalHealth: z.boolean().optional(),
        medicalServices: z.boolean().optional(),
        substanceAbuse: z.boolean().optional(),
        basicNeeds: z.boolean().optional(),
    }).optional(),

    // Referral/Linkages Services
    referral: z.object({
        legalAssistance: z.boolean().optional(),
        dvCrisis: z.boolean().optional(),
        reentry: z.boolean().optional(),
        immigration: z.boolean().optional(),
        financialLit: z.boolean().optional(),
        angerManage: z.boolean().optional(),
        financialAssist: z.boolean().optional(),
    }).optional(),

    // Additional Notes
    // image
    notes: z.string().optional(),

}) 

export const BackgroundSchema = ClientIntakeSchema.pick({
    ethnicity: true,
    publicServices: true,
    mentalHealth: true,
    disabilities: true,
    substanceAbuse: true,
    sexualOffenses: true,
})