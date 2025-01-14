// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {getFirestore, doc, setDoc, onSnapshot} from "firebase/firestore"
import { getDatabase } from 'firebase/database'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByIKuQIakuVrxk6pKrofTOhdtboUzSayg",
  authDomain: "publicentrydevice.firebaseapp.com",
  databaseURL: "https://publicentrydevice-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "publicentrydevice",
  storageBucket: "publicentrydevice.firebasestorage.app",
  messagingSenderId: "487711826637",
  appId: "1:487711826637:web:f25805bbf3da3032cbff84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export {app,auth,getFirestore, doc, setDoc, onSnapshot, getDatabase, ref, set, update, database};
