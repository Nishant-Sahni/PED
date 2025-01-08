// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByIKuQIakuVrxk6pKrofTOhdtboUzSayg",
  authDomain: "publicentrydevice.firebaseapp.com",
  projectId: "publicentrydevice",
  storageBucket: "publicentrydevice.firebasestorage.app",
  messagingSenderId: "487711826637",
  appId: "1:487711826637:web:f25805bbf3da3032cbff84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;