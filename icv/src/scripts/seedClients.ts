import { createClient } from '@/api/make-cases/make-case'
import { generateExampleClients } from '@/lib/seedData'
/**
 * Script to seed example clients to Firestore
 * Run this script with: npm run seed-clients
 */
export const seedClients = async (userId: string) => {
  try {
    // Generate example clients
    const exampleClients = generateExampleClients(userId)
    console.log('exampleClients', exampleClients)

    // Push each client to Firestore
    for (const client of exampleClients) {
        if (!client.id) console.log('no id')
        
        console.log(`Adding client: ${client.firstName} ${client.lastName}`)
        
        // Add client to Firestore
        console.log('callingggggg', client)
        createClient(client)
    }
    
    console.log('Successfully seeded example clients to Firestore')
  } catch (error) {
    console.error('Error seeding clients:', error)
  }
}
