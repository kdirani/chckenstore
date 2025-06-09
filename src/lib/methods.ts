/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases } from "./appwrite";

// Registration (remains correct)
// export async function register(
//   email: string,
//   password: string,
//   name: string,
// ) {
//   try {
//     const user = await account.create(
//       'unique()', // Auto-generate user ID
//       email,
//       password,
//       name
//     );
//     console.log('User created:', user);
//     return user;
//   } catch (error) {
//     console.error('Error:', error);
//     return null;
//   }
// }

// // Login (updated method name)
// export async function login(email: string, password: string) {
//   try {
//     const newSession = await account.createEmailPasswordSession(email, password);
//     const sessionsResponse = await account.listSessions();

//     // Collect all deletion promises (excluding the new session)
//     const deletionPromises = sessionsResponse.sessions
//       .filter(session => session.$id !== newSession.$id)
//       .map(session => account.deleteSession(session.$id));

//     // Wait for all deletion promises to resolve
//     await Promise.all(deletionPromises);

//     console.log('Logged in:', newSession);
//     return newSession;
//   } catch (error) {
//     console.error('Login failed:', error);
//     return null;
//   }
// }

// // Logout (correct)
// export async function logout() {
//   try {
//     await account.deleteSession('current');
//     console.log('Logged out successfully');
//     return true;
//   } catch (error) {
//     console.error('Logout failed:', error);
//     return false;
//   }
// }

// Check if user is logged in
// export async function getCurrentUser() {
//   try {
//     return await account.get() as IUser;
//   } catch (error) {
//     console.log(error)
//     return null;
//   }
// }

export const createDocument = async (
  collectionId: string,
  data: any,
  onSucess: (res: string) => void,
  onError: () => void
) => {
  try {
    const response = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      collectionId,
      'unique()',
      data,
    );
    console.log('Created:', response);
    onSucess(response.$id)
    return response.$id
  } catch (error) {
    console.error('Error creating document:', error);
    onError()
    return ''
  }
};

export const deleteDocument = async (collectionId: string, documentId: string, onSucess: () => void) => {
  try {
    await databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      collectionId,
      documentId
    );
    console.log('Documen/home/munirdev/projects/Courses/src/lib/appwrite.tst deleted');
    onSucess();
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};

export const updateDocument = async (
  collectionId: string,
  documentId: string,
  data: any,
  onSucess: () => void,
  onError?: () => void
) => {
  try {
    // تحديث المستند مباشرة
    const response = await databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      collectionId,
      documentId,
      data
    );
    
    console.log('Updated:', response);
    onSucess();
  } catch (error) {
    console.error('Error updating document:', error);
    if(onError) {
      onError();
    }
  }
};

export const fetchDocuments = async (
  collectionId: string,
  onSucess: (data: any) => void,
  onError: () => void,
  queries?: string[]
) => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DB_ID,
      collectionId,
      queries
    );
    console.log('Documents:', response.documents);
    onSucess(response.documents);
    return response.documents // Return the documents for further use if needed
  } catch (error) {
    console.error('Error fetching documents:', error);
    onError()
  }
};

export const getSingleDocument = async (
  collectionId: string,
  documentId: string,
) => {
  try {
    const document = await databases.getDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      collectionId,
      documentId
    );
    console.log('Document:', document);
    return document
  } catch (error) {
    console.error('Error fetching document:', error);
    return null
  }
}

// export async function getUserProfile(
//   userId: string,
// ) {
//   try {
//     const response = await databases.listDocuments(
//         dbId,
//         PROFILE_COL_ID,  // Replace with your collection ID
//         [
//           Query.equal('userId', userId),
//           Query.limit(1) // Limit to 1 result
//         ]
//     );
//     return response.documents.length > 0 
//         ? response.documents[0] 
//         : null;
        
//   } catch (error) {
//       console.error('Appwrite Error:', error);
//       throw error; // Or handle error as needed
//   }
// }