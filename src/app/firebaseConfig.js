import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyByIKuQIakuVrxk6pKrofTOhdtboUzSayg",
    authDomain: "publicentrydevice.firebaseapp.com",
    projectId: "publicentrydevice",
    storageBucket: "publicentrydevice.firebasestorage.app",
    messagingSenderId: "487711826637",
    appId: "1:487711826637:web:f25805bbf3da3032cbff84"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
