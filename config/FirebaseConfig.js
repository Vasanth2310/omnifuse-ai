// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "omnifuse-ai.firebaseapp.com",
  projectId: "omnifuse-ai",
  storageBucket: "omnifuse-ai.firebasestorage.app",
  messagingSenderId: "440268726401",
  appId: "1:440268726401:web:91c9b4c2af218bad596d80",
  measurementId: "G-ZSPNC6DSJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);