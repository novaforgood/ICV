import { Timestamp } from 'firebase/firestore'

// Enum for contact types
export enum ContactType {
    ReferralAndIntake = 'RI',
    Phone = 'P',
    FaceToFace = 'F',
    TeamMeeting = 'TM',
    IndividualMeeting = 'IM',
    FamilyMeeting = 'FM',
    ReferralToServiceProvider = 'R',
    EmploymentJobReadiness = 'E',
    Transportation = 'T',
    TrackingCheckUp = 'TC',
    Advocacy = 'A',
    EventActivityFieldTrip = 'E',
    Other = 'O',
}

// CaseEvent interface
export interface CaseEvent {
    caseId: string // Unique identifier for the case
    date: Timestamp
    typeOfContact: ContactType // Type of contact using the defined enum
    description?: string // Optional detailed notes about the event
}
