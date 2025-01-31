import { db } from '@/data/firebase'
import { Client } from '@/types/client-types'
import { collection, getDocs, doc, getDoc, QueryDocumentSnapshot, updateDoc } from 'firebase/firestore'

export async function getAllClients(): Promise<Client[]> {
    const clientsCollection = collection(db, 'clients') // Ensure the collection name is correct
    const clientsSnapshot = await getDocs(clientsCollection)

    const clientsList = clientsSnapshot.docs.map((doc) => ({
        id: doc.id, // Firebase document ID
        ...doc.data(), // Other client fields
    })) as ClientType[]

    return clientsList
}

export async function getClientById(clientId: string): Promise<ClientType | null> {
    const clientRef = doc(db, 'clients', clientId);
    const clientSnap = await getDoc(clientRef);
    
    return clientSnap.exists() ? ({ id: clientSnap.id, ...clientSnap.data() } as ClientType) : null;

}

export const updateClient = async (id: string, updatedClientData: ClientType) => {
  const clientRef = doc(db, "clients", id);
  await updateDoc(clientRef, updatedClientData);
};
