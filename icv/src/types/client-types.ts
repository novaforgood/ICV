import { z } from 'zod'

export const GENDER = ['Male', 'Female', 'Nonbinary']
export const CONTACTSOURCE = [
    'Outreach',
    'Police Department',
    'City of Huntington Park',
    'Community',
    'Service Provider',
    'School liaison',
]
export const SERVICESELECT = ['Recipient', 'Not a recipient']
export const CITIZEN = ['Citizen', 'Resident', 'Undocumented']
export const HOMELESS = ['Homeless', 'At risk', 'Vehicle', 'Sheltered', 'Transitional housing', 'Rehabilitation', 'Permanently housed']
export const ETHNICITY = [
    'White',
    'Black or African American',
    'Hispanic, Latino, or Spanish Origin',
    'Asian',
    'Native American',
    'Middle Eastern',
    'Hawaiian or Pacific Islander',
]
export const PUBLIC_SERVICES = [
    'General Relief',
    'CalFresh (Food Stamps/EBT)',
    'CalWorks',
    'SSI',
    'SSA',
    'Unemployment Benefits',
]
export const PETSIZE = ['Small', 'Medium', 'Large']
export const PETPURPOSE = ['Emotional support animal', 'Service animal']
export const EDUSTATUS = [
    'High school',
    'GED',
    'Community college',
    'University',
]
export const MENTALHEALTH = ['Schizophrenia', 'Bipolar', 'Depression', 'Anxiety']
export const SUBSTANCES = ['Meth', 'Cocaine', 'Marijuana', 'Alcohol', 'None']
export const YESNO = ['Yes', 'No']
export const MENTORING = [
    'Problem Solving/Decision Making',
    'Goal Setting',
    'Academic Support',
    'Group Mentoring',
    'Conflict Resolution',
    'Rumor Control Intervention',
]
export const HOUSING = [
    'Emergency Shelter',
    'Hotel Voucher',
    'Shared Living',
    'Independent Living',
    'Management Companies',
    'Rental/Moving Assistance',
]
export const EDUTRAIN = [
    'Independent Studies',
    'Charter Schools',
    'Adult School/GED',
    'Vocational Training School',
    'Financial Aid/College Support',
]

export const REFERRALSERVICE = [
    'Legal Assistance/Food Pantry',
    'DV Crisis Support',
    'Reentry Services',
    'Immigration Services',
    'Financial Literacy',
    'Continued Education',
    'Financial Assistance Programs (SNAP/Cal/Works)',
]
export const PERSONAL_DEV = [
    'Job Readiness',
    'Employment Assistance',
    'Career Development',
    'Creativity & Personal Expression',
]
export const REDIRECTION = [
    'Emergency Shelter',
    'Human Trafficking Resources',
    'Personal Development',
    'Domestic Violence Resources',
    'Transportation',
    'Informal Case Management',
]
export const HEALTH_WELLNESS = [
    'Mental Health',
    'Medical Services',
    'Substance Abuse Treatment',
    'Basic Needs Support',
]
export const EMPLOYMENT = [
    'Full-time',
    'Part-time',
    'Unemployed',
]
export const WAIVER = [
    'I give my permission',
]

export const MARITALSTATUS = [
    'Single',
    'Married',
    'Divorced',
]

export type NewClient = z.infer<typeof ClientIntakeSchema>

export const ClientIntakeSchema = z.object({
    // ----- PAGE 1: Basic intake information -----

    // Client Profile
    docId: z.string().optional(),
    id: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    fullNameLower: z.string().optional(),
    dateOfBirth: z.string().optional(),
    age: z.number().optional(),
    ageRange: z.string().optional(),
    gender: z.string().optional(),
    contactSource: z.string().optional(),
    clientNumber: z.string().optional(),
    intakeDate: z.string().optional(),

    // Citizenship
    placeOrigin: z.string().optional(),
    citizenship: z.string().optional(),

    // Housing
    housingDate: z.string().optional(),
    homeless: z.string().optional(),
    recentHousing: z.string().optional(),
    sheltered: z.string().optional(),
    housingNotes: z.string().optional(),
    streetAddress: z.string().optional(),
    aptNumber: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),

    // Contact Information
    email: z.string().optional(),
    phoneNumber: z.string().optional(),

    // Demographics
    ethnicity: z.array(z.string()).optional(),

    // ----- PAGE 2: Background Information -----
    employment: z.string().optional(),
    employmentIncome: z.string().optional(),

    educationStatus: z.array(z.string().optional()).optional(),
    mentalHealthConditions: z.string().optional(),
    medicalConditions: z.string().optional(),
    substanceAbuse: z.string().optional(),
    fosterYouth: z.string().optional(),
    openProbation: z.string().optional(),
    openCPS: z.string().optional(),
    sexOffender: z.string().optional(),
    historyNotes: z.string().optional(),

    generalRelief: z.string().optional(),
    generalReliefAid: z.string().optional(),
    calFresh: z.string().optional(),
    calFreshAid: z.string().optional(),
    calWorks: z.string().optional(),
    calWorksAid: z.string().optional(),
    ssi:z.string().optional(),
    ssiAid: z.string().optional(),
    ssa: z.string().optional(),
    ssaAid: z.string().optional(),
    unemployment: z.string().optional(),
    unemploymentAid: z.string().optional(),
    otherService: z.string().optional(),
    otherServiceAid: z.string().optional(),

    totalIncome: z.string().optional(),

    // ----- PAGE 3: Family Information -----
    familySize: z.string().optional(),
    maritalStatus: z.string().optional(),
    spouseClientStatus: z.string().optional(),
    spouse: z.object({
            spouseFirstName: z.string().optional(),
            spouseLastName: z.string().optional(),
            spouseDOB: z.string().optional(),
            spouseAge: z.string().optional(),
            spouseIncome: z.string().optional(),
            spouseGender: z.string().optional(),
        }).optional(),
    dependent: z.array(
        z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            dob: z.string().optional(),
            income: z.string().optional(),
            age: z.string().optional(),
            gender: z.string().optional(),
            generalRelief: z.string().optional(),
            generalReliefAid: z.string().optional(),
            calFresh: z.string().optional(),
            calFreshAid: z.string().optional(),
            calWorks: z.string().optional(),
            calWorksAid: z.string().optional(),
            ssi:z.string().optional(),
            ssiAid: z.string().optional(),
            ssa: z.string().optional(),
            ssaAid: z.string().optional(),
            unemployment: z.string().optional(),
            unemploymentAid: z.string().optional(),
            otherService: z.string().optional(),
            otherServiceAid: z.string().optional(),
            totalIncome: z.string().optional(),
        }),
    ).optional(),
    familyMembersServiced: z.string().optional(),
    headOfHousehold: z.string().optional(),

    pets: z.array(
        z.object({
           species: z.string().optional(),
           size: z.string().optional(),
           purpose: z.array(z.string().optional())
        })
    ).optional(),

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
    additionalNotes: z.string().optional(),

    clientPic: z.array(z.object({
        name: z.string().optional(),
        uri: z.string().optional(),
    })).optional(),
    clientIDocs: z.array(z.object({
        name: z.string().optional(),
        uri: z.string().optional(),
    })).optional(),
    clientPassport: z.array(z.object({
        name: z.string().optional(),
        uri: z.string().optional(),
    })).optional(),
    clientMediCal: z.array(z.object({
        name: z.string().optional(),
        uri: z.string().optional(),
    })).optional(),
    clientSSN: z.array(z.object({
        name: z.string().optional(),
        uri: z.string().optional(),
    })).optional(),
    clientBC: z.array(z.object({
        name: z.string().optional(),
        uri: z.string().optional(),
    })).optional(),
    otherFiles: z.array(z.object({
        name: z.string().optional(),
        uri: z.string().optional(),
    })).optional(),



    // ----- PAGE 5: CONFIRMATION PAGE ----
    clientCode: z.string().optional(),
    assessingStaff: z.string().optional(),
    //program: z.string().optional(),
    caseManager: z.string().optional(),
    // permission: z.boolean().optional(),

    // ----- WAIVER -----
    clientSig1: z.string().optional(),
    clientSig2: z.string().optional(),
    guardianSig: z.string().optional(),
    thirdParties: z.string().optional(),
    disclosurePurpose: z.string().optional(),
    signDate: z.string().optional(),
    waivers: z.array(z.object({name: z.string().optional(), uri: z.string().optional()})).optional(),

    associatedSpouseID: z.string().optional(),
}) 

export const BackgroundSchema = ClientIntakeSchema.pick({
    employment: true,
    employmentIncome: true,
    educationStatus: true,
    mentalHealthConditions: true,
    medicalConditions: true,
    substanceAbuse:true,
    fosterYouth:true,
    openProbation: true,
    openCPS:true,
    sexOffender:true,
    historyNotes:true,

    // Public Services
    generalRelief: true,
    generalReliefAid: true,
    calFresh: true,
    calFreshAid: true,
    calWorks: true,
    calWorksAid: true,
    ssi: true,
    ssiAid: true,
    ssa: true,
    ssaAid: true,
    unemployment: true,
    unemploymentAid: true,
    otherService: true,
    otherServiceAid: true,

    totalIncome: true,
})

export const ServicesSchema = ClientIntakeSchema.pick({
    mentoring: true,
    personalDev: true,
    housing: true,
    redirection: true,
    education: true,
    healthWellness: true,
    referral: true,

    clientPic: true,
    clientIDocs: true,
    clientPassport: true,
    clientMediCal:true,
    clientSSN:true,
    clientBC:true,
    otherFiles: true,
    additionalNotes: true,
})

export const ProfileSchema = ClientIntakeSchema.pick({
    firstName:true,
    lastName: true,
    dateOfBirth: true,
    age: true,
    ageRange: true,
    gender: true,
    contactSource: true,
    clientNumber: true,
    clientCode: true,
    intakeDate: true,

    // Citizenship
    placeOrigin: true,
    citizenship: true,

    // Housing
    housingDate: true,
    homeless: true,
    recentHousing: true,
    sheltered: true,
    housingNotes: true,
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

    associatedSpouseID: true,

})

export const FamilySchema = ClientIntakeSchema.pick({
    familySize: true,
    spouse: true,
    maritalStatus: true,
    spouseClientStatus: true,
    dependent: true,
    pets: true,
    familyMembersServiced: true,
    headOfHousehold: true,
    associatedSpouseID: true,
})

export const ConfirmationSchema = ClientIntakeSchema.pick({
    assessingStaff: true,
})

export const WaiverSchema = ClientIntakeSchema.pick({
    clientSig1: true,
    clientSig2: true,
    guardianSig: true,
    thirdParties: true,
    disclosurePurpose: true,
    signDate: true,
    waivers: true,
})