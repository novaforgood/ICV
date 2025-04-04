import { date, z } from 'zod'
import { timestampToDateSchema} from './misc-types'

export const Gender = z.enum(['Male', 'Female', 'Non-Binary', 'Other'])
export const Program = z.enum(['Homeless Department', 'School Outreach', 'Other'])
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

export type Gender = z.infer<typeof Gender>
export type HousingType = z.infer<typeof HousingType>
export type Ethnicity = z.infer<typeof Ethnicity>
export type Pets = z.infer<typeof Pets>
export type Program = z.infer<typeof Program>

export type NewClient = z.infer<typeof ClientIntakeSchema>

export const ClientIntakeSchema = z.object({
    // ----- PAGE 1: Basic intake information -----

    // Client Profile
    id: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    referralSource: z.string().optional(),
    clientNumber: z.string().optional(),

    // Citizenship
    placeOrigin: z.string().optional(),
    citizenship: z.string().optional(),

    // Housing
    homeless: z.string().optional(),
    durationHomeless: z.string().optional(),
    housingSituation: z.string().optional(),
    streetAddress: z.string().optional(),
    aptNumber: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),

    // Contact Information
    email: z.string().optional(),
    phoneNumber: z.string().optional(),

    // Demographics
    ethnicity: z.array(z.string()).optional(),
    employed: z.string().optional(),
    income: z.string().optional(),

    // ----- PAGE 2: Family Information -----
    familySize: z.string().optional(),
    spouse: z.array(
        z.object({
            spouseFirstName: z.string().optional(),
            spouseLastName: z.string().optional(),
            spouseDOB: z.string().optional(),
            spouseIncome: z.string().optional(),
            spouseGender: z.string().optional(),
        }),
    ).optional(),
    dependent: z.array(
        z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            dob: z.string().optional(),
            income: z.string().optional(),
            gender: z.string().optional(),
            publicServices: z.array(z.string().optional()).optional()
        }),
    ).optional(),

    pets: z.array(
        z.object({
           species: z.string().optional(),
           size: z.string().optional(),
           purpose: z.array(z.string().optional())
        })
    ).optional(),

    // ----- PAGE 3: Background Information -----
    educationStatus: z.array(z.string().optional()).optional(),
    cps: z.string().optional(),
    cpsNotes: z.string().optional(),
    probation: z.string().optional(),
    probationNotes: z.string().optional(),
    fosterYouth: z.string().optional(),
    fosterNotes: z.string().optional(),
    sexOffender: z.string().optional(),
    sexOffNotes: z.string().optional(),
    mentalHealth: z.array(z.string().optional()).optional(),
    mentalHealthNotes: z.string().optional(),
    medicalHistory: z.string().optional(),
    substanceAbuse: z.array(z.string().optional()).optional(),
    substanceNotes:  z.string().optional(),
    publicServices: z.array(z.string().optional()).optional(),

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
    
    // Image Upload
    clientImage: z.array(z.string().optional(),).optional(),
    clientPassport: z.array(z.string().optional(),).optional(),
    clientMed: z.array(z.string().optional(),).optional(),
    clientSSN: z.array(z.string().optional(),).optional(),
    clientBC: z.array(z.string().optional(),).optional(),
    otherFiles: z.array(z.string().optional(),).optional(),

    clientImageName: z.array(z.string().optional(),).optional(),
    clientIDName: z.array(z.string().optional(),).optional(),
    clientPassportName: z.array(z.string().optional(),).optional(),
    clientMedName: z.array(z.string().optional(),).optional(),
    clientSSNName: z.array(z.string().optional(),).optional(),
    clientBCName: z.array(z.string().optional(),).optional(),
    otherFilesName: z.array(z.string().optional(),).optional(),

    // kits
    hygieneKit: z.string().optional(),
    hotMeal: z.string().optional(),
    snackPack: z.string().optional(),

    // ----- PAGE 5: CONFIRMATION PAGE ----
    clientCode: z.string().optional(),
    //assessingStaff: z.string().optional(),
    //program: z.string().optional(),
    // caseManager: z.string().optional(),
    // permission: z.boolean().optional(),
}) 

export const BackgroundSchema = ClientIntakeSchema.pick({
    educationStatus: true,
    cps: true,
    cpsNotes: true,
    probation: true,
    probationNotes: true,
    fosterYouth: true,
    fosterNotes: true,
    sexOffender: true,
    sexOffNotes: true,
    mentalHealth: true,
    mentalHealthNotes: true,
    medicalHistory: true,
    substanceAbuse: true,
    substanceNotes: true,
    publicServices: true,
})

export const ServicesSchema = ClientIntakeSchema.pick({
    mentoring: true,
    personalDev: true,
    housing: true,
    redirection: true,
    education: true,
    healthWellness: true,
    referral: true,
    clientImage: true,
    clientPassport: true,
    clientMed: true,
    clientSSN: true,
    clientBC: true,
    otherFiles: true,
    clientImageName: true,
    clientIDName: true,
    clientPassportName: true,
    clientMedName: true,
    clientSSNName: true,
    clientBCName: true,
    otherFilesName: true,
    notes: true,
    hygieneKit: true,
    hotMeal: true,
    snackPack: true,
})

export const ProfileSchema = ClientIntakeSchema.pick({
    firstName:true,
    lastName: true,
    dateOfBirth: true,
    // age: true,
    gender: true,
    referralSource: true,
    clientNumber: true,

    // Citizenship
    placeOrigin: true,
    citizenship: true,

    // Housing
    homeless: true,
    durationHomeless: true,
    housingSituation: true,
    streetAddress: true,
    aptNumber:true,
    city: true,
    zipCode: true,

    // Contact Information
    email: true,
    // areaCode: true,
    phoneNumber: true,

    // Demographics
    ethnicity: true,
    employed: true,
    income: true,

})

export const FamilySchema = ClientIntakeSchema.pick({
    familySize: true,
    spouse: true,
    dependent: true,
    pets: true,
})