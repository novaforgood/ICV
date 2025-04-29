'use server'

import { createClient } from '@/api/make-cases/make-case';


// Generate example clients
const generateExampleClients = (userId: string) => {
  console.log('began', userId)
  const currentDate = new Date();
  const oneMonthAgo = new Date(currentDate);
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  
  const twoMonthsAgo = new Date(currentDate);
  twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
  
  const threeMonthsAgo = new Date(currentDate);
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
  
  const exampleClients = [
    {
      id: 'client-1',
      firstName: 'John',
      lastName: 'Doe',
      fullNameLower: 'john doe',
      dateOfBirth: '1985-06-15',
      gender: 'Male',
      clientCode: 'JD-2023-001',
      caseManager: userId,
      phoneNumber: '555-123-4567',
      email: 'john.doe@example.com',
      address: '123 Main St, Anytown, CA 90210',
      createdAt: oneMonthAgo.toISOString(),
      updatedAt: currentDate.toISOString(),
      status: 'Active',
      notes: 'Client is making good progress with housing stability.',
      lastContactDate: oneMonthAgo.toISOString(),
      nextAppointment: new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      clientImage: ['https://firebasestorage.googleapis.com/v0/b/nova-icv-dev.appspot.com/o/profile_placeholder.png?alt=media']
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
      address: '456 Oak Ave, Somewhere, CA 90211',
      createdAt: twoMonthsAgo.toISOString(),
      updatedAt: currentDate.toISOString(),
      status: 'Active',
      notes: 'Client is actively seeking employment opportunities.',
      lastContactDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      nextAppointment: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      clientImage: ['https://firebasestorage.googleapis.com/v0/b/nova-icv-dev.appspot.com/o/profile_placeholder.png?alt=media']
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
      phoneNumber: '555-456-7890',
      email: 'michael.johnson@example.com',
      address: '789 Pine St, Elsewhere, CA 90212',
      createdAt: threeMonthsAgo.toISOString(),
      updatedAt: currentDate.toISOString(),
      status: 'Active',
      notes: 'Client is attending therapy sessions regularly.',
      lastContactDate: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      nextAppointment: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      clientImage: ['https://firebasestorage.googleapis.com/v0/b/nova-icv-dev.appspot.com/o/profile_placeholder.png?alt=media']
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
      phoneNumber: '555-234-5678',
      email: 'sarah.williams@example.com',
      address: '321 Elm St, Nowhere, CA 90213',
      createdAt: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: currentDate.toISOString(),
      status: 'Active',
      notes: 'Client is enrolled in GED program.',
      lastContactDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      nextAppointment: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      clientImage: ['https://firebasestorage.googleapis.com/v0/b/nova-icv-dev.appspot.com/o/profile_placeholder.png?alt=media']
    }
  ];
  
  return exampleClients;
};

export async function seedExampleData(userId: string) {
  try {
    if (!userId) {
      throw new Error('No user ID provided')
    }

    // Generate example clients
    const exampleClients = generateExampleClients(userId)
    
    const createdClients = []
    
    // Push each client to Firestore
    for (const client of exampleClients) {      
      try {
        // Remove the predefined ID as Firestore will generate one
        const { id, ...clientData } = client
        
        // Add client to Firestore
        const newClientId = await createClient(clientData)
        
        createdClients.push({
          id: newClientId,
          name: `${client.firstName} ${client.lastName}`,
          clientCode: client.clientCode
        })
      } catch (clientError) {
        console.error(`Error creating client ${client.firstName} ${client.lastName}:`, clientError)
      }
    }
    
    if (createdClients.length === 0) {
      return { success: false, message: 'No clients were created' }
    }
    
    console.log('Successfully created clients:', createdClients)
    return { 
      success: true, 
      message: `Successfully created ${createdClients.length} clients`,
      clients: createdClients 
    }
  } catch (error) {
    console.error('Error in seedExampleData:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error seeding example data'
    }
  }
} 