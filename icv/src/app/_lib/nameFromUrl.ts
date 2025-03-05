import { ref, getMetadata} from "firebase/storage"
import { storage } from "@/data/firebase"

export const extractFileNameFromURL = async (fileURL: string): Promise<string | null> => {
    try {
      // Get Firebase storage reference from the URL
      const fileRef = ref(storage, fileURL);
  
      // Fetch the metadata of the file
      const metadata = await getMetadata(fileRef);
  
      // Return the file name from metadata
      return metadata.name;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  };