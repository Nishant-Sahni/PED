// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, set, update } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByIKuQIakuVrxk6pKrofTOhdtboUzSayg",
  authDomain: "publicentrydevice.firebaseapp.com",
  databaseURL: "https://publicentrydevice-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "publicentrydevice",
  storageBucket: "publicentrydevice.firebasestorage.app",
  messagingSenderId: "487711826637",
  appId: "1:487711826637:web:f25805bbf3da3032cbff84",
};

// Initialize Firebase app only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google Popup
 * @returns {Promise} - Returns a promise with user credential
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider); // Google sign-in popup
    const user = result.user; // The signed-in user info

    console.log("Google Sign-In Successful");
    console.log("User Info:", user);

    return user; // Return user object for further usage
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    throw error; // Re-throw error for handling
  }
};

// Exports
export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  onAuthStateChanged,
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  getDatabase,
  ref,
  set,
  update,
  database,
};
