import { collection, query, where, getDocs } from "firebase/firestore";
import { NewClient } from "@/types/client-types";
import { clientDb } from "@/data/firebase";

/**
 * Search for documents in Firestore by keyword
 * @param {string} collectionName - The collection to search in
 * @param {string} field - The field to search in
 * @param {string} keyword - The keyword to search for
 * @returns {Promise<Array>} - Array of matching documents
 */

const collectionName = "clients"


export const searchByKeyword = async (searchTerm: string) => {
  try {
    const clientsRef = collection(clientDb, collectionName);
    
    // Convert search term to lowercase for case-insensitive search
    const searchTermLower = searchTerm.toLowerCase();
    
    // Query for documents where fullNameLower contains the search term
    const q = query(
      clientsRef,
      where("fullNameLower", ">=", searchTermLower),
      where("fullNameLower", "<", searchTermLower + "\uf8ff")
    );
    
    const querySnapshot = await getDocs(q);
    const results: NewClient[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({ id: doc.id, ...data } as NewClient);
    });
    
    return results;
  } catch (error) {
    console.error("Error searching clients:", error);
    throw error;
  }
};