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
    // Intake Information
    // programInfo
    // staffInfo
    // dateInfo

    // Client Profile
    id: z.string().optional(),
    program: z.string().optional(),
    assessingStaff: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    // age: z.string().optional(),
    gender: Gender.optional(),
    clientNumber: z.string().optional(),

    // Housing
    housingType: HousingType.optional(),
    atRisk: z.boolean().optional(),
    streetAddress: z.string().optional(),
    aptNumber: z.string().optional(),
    city: z.string().optional(),
    // state: z.string().optional(),
    zipCode: z.string().optional(),

    // Contact Information
    email: z.string().optional(),
    // areaCode: z.string().optional(),
    phoneNumber: z.string().optional(),

    // ----- PAGE 2: Family Information -----
    familySize: z.string().optional(),
    spouse: z.array(
        z.object({
            spouseFirstName: z.string().optional(),
            spouseLastName: z.string().optional(),
            spouseDOB: z.string().optional(),
            spouseAge: z.string().optional(),
        }),
    ).optional(),
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
    
    // Image Upload
    clientImage: z.string().optional(),


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
    clientImage: true,
    notes: true,
})

export const ProfileSchema = ClientIntakeSchema.pick({
    program: true,
    assessingStaff: true,
    firstName:true,
    lastName: true,
    dateOfBirth: true,
    // age: true,
    gender: true,
    clientNumber: true,

    // Housing
    housingType: true,
    atRisk: true,
    streetAddress: true,
    aptNumber:true,
    city: true,
    // state: true,
    zipCode: true,

    // Contact Information
    email: true,
    // areaCode: true,
    phoneNumber: true,

})

export const FamilySchema = ClientIntakeSchema.pick({
    familySize: true,
    spouse: true,
    children: true,
    pets: true,
})