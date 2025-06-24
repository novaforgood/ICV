'use server'
import 'server-only'

import { getAuthenticatedAppForUser } from '@/lib/serverApp'
import { NewClient } from '@/types/client-types'
import { collection, getDoc, getDocs, getFirestore, doc, where, limit, orderBy, query, setDoc, deleteDoc } from 'firebase/firestore'
import { Resend } from "resend"
import { getApp, getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import  {Users} from '@/types/user-types'
import { User } from 'firebase/auth'


// Extended client type with lastCheckinDate
interface ClientWithLastCheckin extends NewClient {
    lastCheckinDate?: string;
}

export async function start2FA(email: string) {
    if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      }
      
    const ssrdb = getAdminFirestore();

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

    // Store in Firestore using Admin SDK
    await ssrdb.collection("2faCodes").doc(email).set({
        code,
        expiresAt,
        createdAt: new Date()
    })

    
    // Email it 
    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
        await resend.emails.send({
            from: 'noreply@yourapp.com', 
            to: email,
            subject: 'Your ICV 2FA Code',
            html: `<p>Your verification code is <strong>${code}</strong>. This code expires in 15 minutes.</p>`
        })
        console.log('Verification code sent successfully to:', email)
    } catch (err) {
        console.error('Failed to send verification code:', err)
        // Don't throw error here, just log it so the 2FA process can continue
    }

    return { success: true }
}

export async function verify2FA(email:string, verificationCode: string) {
    if (!getApps().length) {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      }
      
    const ssrdb = getAdminFirestore();

    const codeDocRef = ssrdb.collection("2faCodes").doc(email);
    const docSnap = await codeDocRef.get();

    if (!docSnap.exists){
        throw new Error("Invalid or expired code.");
    }

    const { code: storedCode, expiresAt } = docSnap.data() as { code: string; expiresAt: number };

    if (Date.now() > expiresAt) {
        // Delete the expired code
        await codeDocRef.delete();
        throw new Error("Code has expired.");
    }

    if (storedCode !== verificationCode) {
        throw new Error("Invalid code.");
    }

    // Success! Delete the code so it can't be reused.
    await codeDocRef.delete();

    return { success: true };
}

export async function getAllClients(): Promise<NewClient[]> {
    const { firebaseServerApp, currentUser } = 
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients') 
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map((doc) => {//returns array of client objects by applying arrow function to docs snapshot
        const data = doc.data() as NewClient
        data.docId = doc.id
        return data
    })
    return clientsList
}

export async function getAllUsers():  Promise<Users[]> {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const userCollection = collection(ssrdb, 'users')
    const usersSnapshot = await getDocs(userCollection)
    const userList = usersSnapshot.docs.map((doc) => {
        const data = doc.data() as Users
        return {
            id: doc.id,
            ...data
        }
    })
    return userList
}

export async function getUsersCollection(): Promise<string[]> {
        const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const collectRef = collection(ssrdb, 'users')
    const querySnapshot = await getDocs(collectRef)
    const users = querySnapshot.docs.map((doc) => String(doc.data().name))

    return users
}

export async function getClientById(id: string) {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientDoc = await getDoc(doc(clientsCollection, id))
    const client = clientDoc.data() as NewClient
    client.docId = clientDoc.id
    return client
}

export async function getClientByCaseManager(): Promise<ClientWithLastCheckin[]> {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const caseManagerId = currentUser.displayName

    const clientsCollection = collection(ssrdb, 'clients')
    const clientsQuery = query(clientsCollection, where('caseManager', '==', caseManagerId))
    const clientsSnapshot = await getDocs(clientsQuery)
    const clientsList = clientsSnapshot.docs.map((doc) => {
        const data = doc.data() as NewClient;
        data.id = doc.id;
        return data;
    });

    // Get the latest event date for each client
    const clientsWithLatestEvents = await Promise.all(
        clientsList.map(async (client) => {
            if (!client.id) return client as ClientWithLastCheckin;
            
            // Query the events collection for this client
            const eventsCollection = collection(ssrdb, 'events');
            const eventsQuery = query(
                eventsCollection, 
                where('clientId', '==', client.id),
                orderBy('endTime', 'desc'),
                limit(1)
            );
            
            const eventsSnapshot = await getDocs(eventsQuery);
            
            // If there are events, add the latest endTime to the client object
            if (!eventsSnapshot.empty) {
                const latestEvent = eventsSnapshot.docs[0].data();
                const timestamp = latestEvent.endTime;
                let dateString = null;
                
                if (timestamp) {
                    if (typeof timestamp === 'string') {
                        dateString = timestamp;
                    } else if (timestamp.toDate) {
                        // Convert Firestore Timestamp to ISO string
                        dateString = timestamp.toDate().toISOString();
                    } else if (timestamp.seconds) {
                        // Handle Firestore Timestamp object directly
                        dateString = new Date(timestamp.seconds * 1000).toISOString();
                    }
                }
                
                return {
                    ...client,
                    lastCheckinDate: dateString
                } as ClientWithLastCheckin;
            }
            return client as ClientWithLastCheckin;
        })
    );

    // Sort clients by lastCheckinDate in descending order (most recent first)
    // Clients without a lastCheckinDate will be placed at the end
    const sortedClients = [...clientsWithLatestEvents].sort((a, b) => {
        // If both have dates, compare them
        if (a.lastCheckinDate && b.lastCheckinDate) {
            return new Date(b.lastCheckinDate).getTime() - new Date(a.lastCheckinDate).getTime();
        }
        // If only one has a date, the one with a date comes first
        if (a.lastCheckinDate) return -1;
        if (b.lastCheckinDate) return 1;
        // If neither has a date, maintain original order
        return 0;
    });

    return sortedClients;
}

export async function getAllClientsByLastCheckinDate(): Promise<ClientWithLastCheckin[]> {
    const { firebaseServerApp, currentUser } =
        await getAuthenticatedAppForUser()
    if (!currentUser) {
        throw new Error('User not found')
    }
    const ssrdb = getFirestore(firebaseServerApp)

    const clientsCollection = collection(ssrdb, 'clients')
    const clientsSnapshot = await getDocs(clientsCollection)
    const clientsList = clientsSnapshot.docs.map((doc) => {
        const data = doc.data() as NewClient;
        data.id = doc.id;
        return data;
    });

    // Get the latest event date for each client
    const clientsWithLatestEvents = await Promise.all(
        clientsList.map(async (client) => {
            if (!client.id) return client as ClientWithLastCheckin;
            
            // Query the events collection for this client
            const eventsCollection = collection(ssrdb, 'events');
            const eventsQuery = query(
                eventsCollection, 
                where('clientId', '==', client.id),
                orderBy('endTime', 'desc'),
                limit(1)
            );
            
            const eventsSnapshot = await getDocs(eventsQuery);
            
            // If there are events, add the latest endTime to the client object
            if (!eventsSnapshot.empty) {
                const latestEvent = eventsSnapshot.docs[0].data();
                const timestamp = latestEvent.endTime;
                let dateString = null;
                
                if (timestamp) {
                    if (typeof timestamp === 'string') {
                        dateString = timestamp;
                    } else if (timestamp.toDate) {
                        // Convert Firestore Timestamp to ISO string
                        dateString = timestamp.toDate().toISOString();
                    } else if (timestamp.seconds) {
                        // Handle Firestore Timestamp object directly
                        dateString = new Date(timestamp.seconds * 1000).toISOString();
                    }
                }
                
                return {
                    ...client,
                    lastCheckinDate: dateString
                } as ClientWithLastCheckin;
            }
            return client as ClientWithLastCheckin;
        })
    );

    return clientsWithLatestEvents;
}

