import { Timestamp } from 'firebase/firestore'

export enum Gender {
    Male = 'Male',
    Female = 'Female',
    Other = 'Other',
}

export enum Ethnicity {
    AfricanAmerican = 'African American',
    Asian = 'Asian',
    LatinoHispanic = 'Latino/Hispanic',
    NativeAmerican = 'Native American',
    WhiteCaucasian = 'White/Caucasian',
    Other = 'Other',
}

export enum FosterYouthStatus {
    Current = 'Yes, Currently',
    Previous = 'Yes, Previously',
    No = 'No',
}

export enum EmploymentStatus {
    No = 'No',
    PartTime = 'Yes, Part-Time',
    FullTime = 'Yes, Full-Time',
}

export enum ProbationStatus {
    No = 'No',
    Previously = 'Yes, Previously',
    Currently = 'Yes, Currently',
}

export enum ClientStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

export enum OpenClientStatus {
    Current = 'Yes, Currently',
    Previous = 'Yes, Previously',
    No = 'No',
}

export interface Client {
    // Basic client details
    lastName: string
    firstName: string
    middleInitial?: string
    dateOfBirth: Timestamp
    gender: Gender
    otherGender?: string // Fallback for "Other"
    age: number

    // Spouse information
    spouseName?: string
    spouseAge?: number
    spouseGender?: Gender
    spouseOtherGender?: string // Fallback for "Other"

    // Location and contact details
    address?: string
    aptNumber?: string
    city: string
    zipCode: string
    phoneNumber: string
    email?: string

    // Program and intake details
    program: string // E.g., "Homeless Outreach"
    intakeDate: Timestamp
    primaryLanguage?: string
    clientCode: string

    // Housing and referral details
    housingType?: string // E.g., "Temporary Shelter"
    birthplace?: string // E.g., City or Country
    referralSource?: string // E.g., "Community Organization"

    // Family and demographic details
    familySize: number // Total number in family
    numberOfChildren: number
    childrenDetails?: { name: string; age: number }[]
    ethnicity: Ethnicity

    // Public services information
    publicServices: {
        generalRelief: boolean // Assistance for basic needs
        calFresh: boolean // Food assistance (EBT)
        calWorks: boolean // Cash aid program
        ssi: boolean // Supplemental Security Income
        ssa: boolean // Social Security Administration
        unemployment: boolean // Unemployment benefits
    }

    // Assessment and client details
    needsAssessment?: string[] // List of specific needs
    openClientWithChildFamilyServices?: OpenClientStatus // Current or past involvement
    previousArrests?: boolean
    probationStatus?: ProbationStatus

    // Education and employment
    education: {
        hasHighSchoolDiploma: boolean
        fosterYouthStatus?: FosterYouthStatus // Foster care history
    }
    employmentStatus?: EmploymentStatus

    // Medical and mental health information
    substanceAbuseDetails?: string // Substance abuse history
    medicalConditions?: string[] // List of medical conditions
    mentalHealthDiagnosis?: string[] // Mental health diagnoses

    // Client management
    assignedClientManager?: string
    assignedDate?: Timestamp
    status: ClientStatus // Active or Inactive

    // Additional notes
    notes?: string
}
