import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Import Firestore instance

// 🔍 Function to search for names using the keywords array
export async function searchByKeyword(searchTerm: string) {
    const collectionRef = collection(db, "clients"); // Change collection name if needed
    try {
        const querySnapshot = await getDocs(collectionRef);
        const results: {
            id: string;
            name: string;
            gender: string;
            middleInitial: string;
            phoneNumber: string;
            dateOfBirth: string;
            age: number;
           }[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.firstName.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({ 
                id: doc.id, 
                name: data.firstName + " " + data.lastName, 
                gender: data.gender,
                middleInitial: data.middleInitial,
                phoneNumber: data.phoneNumber,
                dateOfBirth: data.dateOfBirth.toDate().toLocaleDateString(),
                age: data.age
            });
            }
        });
        console.log("Search results:", results);
        return results;

        // return results;
    } catch (error) {
        console.error("Error searching by keyword:", error);
        return [];
    }
}

// 🔠 Function to generate keyword variations for a name
export function generateKeywords(name: string) {
    const keywords: string[] = [];
    const words = name.toLowerCase().split(" "); // Split name into words

    words.forEach((word) => {
        keywords.push(word);
        for (let i = 1; i < word.length; i++) {
            keywords.push(word.substring(0, i + 1));
        }
    });

    return keywords;
}

// ➕ Function to add a user with keyword indexing
export async function addUser(userId: string, name: string) {
    const keywords = generateKeywords(name);

    const userDoc = {
        name,
        keywords
    };

    try {
        await setDoc(doc(db, "users", userId), userDoc);
        console.log("User added successfully:", name);
    } catch (error) {
        console.error("Error adding user:", error);
    }
}
