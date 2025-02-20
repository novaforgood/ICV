import { date, z } from 'zod'
import { timestampToDateSchema} from './misc-types'

export const Gender = z.enum(['Male', 'Female', 'Non-Binary', 'Other'])
export const HousingType = z.enum(['Not Sure', 'What Design', 'Wants Here', 'Other'])
export const Pets = z.enum(['Dog', 'Cat', 'Bird', "Hamster", 'Rabbit', 'Reptile', 'Other'])
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
    age: z.string().optional(),

    // Spouse information
    spouseName: z.string().optional(),
    spouseAge: z.string().optional(),
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
    familySize: z.string().optional(),
    childrenDetails: z
        .array(
            z.object({
                name: z.string().optional(),
                age: z.string().optional(),
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
export type HousingType = z.infer<typeof HousingType>
export type Ethnicity = z.infer<typeof Ethnicity>
export type FosterYouthStatus = z.infer<typeof FosterYouthStatus>
export type EmploymentStatus = z.infer<typeof EmploymentStatus>
export type ProbationStatus = z.infer<typeof ProbationStatus>
export type ClientStatus = z.infer<typeof ClientStatus>
export type OpenClientStatus = z.infer<typeof OpenClientStatus>
export type Pets = z.infer<typeof Pets>

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
    dateOfBirth: z.string().optional(),
    age: z.string().optional(),
    gender: Gender.optional(),
    clientNumber: z.string().optional(),

    // Housing
    housingType: HousingType.optional(),
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
    familySize: z.string().optional(),
    hasSpouse: z.boolean().optional(),
    spouseFirstName: z.string().optional(),
    spouseLastName: z.string().optional(),
    spouseDOB: z.string().optional(),
    spouseAge: z.string().optional(),

    children: z.array(
        z.object({
            name: z.string().optional(),
            age: z.string().optional(),
        }),
    ).optional(),

    pets: z.array(
        z.object({
            breed: Pets.optional()
        })
    ).optional(),

    // ----- PAGE 3: Background Information -----
    ethnicity: z.array(z.string()).optional(),
    mentalHealth: z.string().optional(),
    disabilities: z.string().optional(),
    substanceAbuse: z.string().optional(),
    sexualOffenses: z.string().optional(),

    publicServices: z.array(z.string()).optional(),

    // ----- PAGE 4: Services -----
    // Mentoring
    mentoring: z.array(z.string()).optional(),

    // Personal Development
    personalDev: z.array(z.string()).optional(),

    // Housing Assistance
    housing: z.array(z.string()).optional(),

    // Redirection Program
    redirection: z.array(z.string()).optional(),

    // Education & Training Support
    education: z.array(z.string()).optional(),

    // Health & Wellness Support
    healthWellness: z.array(z.string()).optional(),

    // Referral/Linkages Services
    referral: z.array(z.string()).optional(),
    
    // Additional Notes
    notes: z.string().optional(),
    
    // Image Upload - store the URL in Firebase
    // imageURL: z.string().url().optional()

}) 

export const BackgroundSchema = ClientIntakeSchema.pick({
    ethnicity: true,
    publicServices: true,
    mentalHealth: true,
    disabilities: true,
    substanceAbuse: true,
    sexualOffenses: true,
})

export const ServicesSchema = ClientIntakeSchema.pick({
    mentoring: true,
    personalDev: true,
    housing: true,
    redirection: true,
    education: true,
    healthWellness: true,
    referral: true,
    // imageURL: true,
    notes: true,
})

export const ProfileSchema = ClientIntakeSchema.pick({
    firstName:true,
    lastName: true,
    dateOfBirth: true,
    age: true,
    gender: true,
    clientNumber: true,

    // Housing
    housingType: true,
    atRisk: true,
    streetAddress: true,
    aptNumber:true,
    city: true,
    state: true,
    zipCode: true,

    // Contact Information
    email: true,
    areaCode: true,
    phoneNumber: true,

})

export const FamilySchema = ClientIntakeSchema.pick({
    familySize: true,
    hasSpouse: true,
    spouseFirstName: true,
    spouseLastName: true,
    spouseDOB: true,
    spouseAge: true,
    children: true,
    pets: true,
})