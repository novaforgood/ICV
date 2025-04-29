import { NewClient } from '@/types/client-types'

/**
 * Generate example clients with the current user as their case manager
 * @param userId The ID of the current logged-in user
 * @returns Array of example clients
 */
export const generateExampleClients = (userId: string): NewClient[] => {
  const currentDate = new Date()
  const oneMonthAgo = new Date(currentDate)
  oneMonthAgo.setMonth(currentDate.getMonth() - 1)
  
  const twoMonthsAgo = new Date(currentDate)
  twoMonthsAgo.setMonth(currentDate.getMonth() - 2)
  
  const threeMonthsAgo = new Date(currentDate)
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3)
  
  const exampleClients: NewClient[] = [
    {
      id: 'client-1',
      firstName: 'John',
      lastName: 'Doe',
      fullNameLower: 'john doe',
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      clientCode: 'JD-2023-001',
      caseManager: userId,
      housing: ['Emergency Shelter'],
      phoneNumber: '555-123-4567',
      email: 'john.doe@example.com',
      streetAddress: '123 Main St',
      city: 'Anytown',
      zipCode: '90210',
      notes: 'Client is making good progress with housing stability.',
      clientImage: ['https://firebasestorage.googleapis.com/v0/b/nova-icv-dev.appspot.com/o/profile_placeholder.png?alt=media'],
    },
    {
      id: 'client-2',
      firstName: 'Jane',
      lastName: 'Smith',
      fullNameLower: 'jane smith',
      dateOfBirth: '1992-03-22',
      gender: 'Female',
      clientCode: 'JS-2023-002',
      caseManager: userId,
      phoneNumber: '555-987-6543',
      email: 'jane.smith@example.com',
      notes: 'Client is actively seeking employment opportunities.',
      clientImage: ['https://firebasestorage.googleapis.com/v0/b/nova-icv-dev.appspot.com/o/profile_placeholder.png?alt=media'],
      personalDev: ['Job Readiness', 'Employment Assistance'],

    },
    {
      id: 'client-3',
      firstName: 'Michael',
      lastName: 'Johnson',
      fullNameLower: 'michael johnson',
      dateOfBirth: '1978-11-05',
      gender: 'Male',
      clientCode: 'MJ-2023-003',
      caseManager: userId,
      healthWellness: ['Mental Health'],
      phoneNumber: '555-456-7890',
      email: 'michael.johnson@example.com',
      streetAddress: '789 Pine St',
      city: 'Elsewhere',
      zipCode: '90212',
      notes: 'Client is attending therapy sessions regularly.',
      clientImage: ['https://firebasestorage.googleapis.com/v0/b/nova-icv-dev.appspot.com/o/profile_placeholder.png?alt=media'],

    },
    {
      id: 'client-4',
      firstName: 'Sarah',
      lastName: 'Williams',
      fullNameLower: 'sarah williams',
      dateOfBirth: '1995-08-30',
      gender: 'Female',
      clientCode: 'SW-2023-004',
      caseManager: userId,
      education: ['Adult School/GED'],
      phoneNumber: '555-234-5678',
      email: 'sarah.williams@example.com',
      streetAddress: '321 Elm St',
      city: 'Nowhere',
      zipCode: '90213',
      notes: 'Client is enrolled in GED program.',
      clientImage: ['https://firebasestorage.googleapis.com/v0/b/nova-icv-dev.appspot.com/o/profile_placeholder.png?alt=media'],
    }
  ]
  
  return exampleClients
} 