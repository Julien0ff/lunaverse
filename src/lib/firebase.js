import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Votre configuration Firebase
// Vous la trouverez dans les paramètres de votre projet sur la console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDmvjX6wc5OoaG3Eyu2-hq_R3GcbCYBu14",
  authDomain: "lunaverse-88e6c.firebaseapp.com",
  projectId: "lunaverse-88e6c",
  storageBucket: "lunaverse-88e6c.firebasestorage.app",
  messagingSenderId: "1083796264809",
  appId: "1:1083796264809:web:0512d9562adba1d202cff8",
  measurementId: "G-DXG0S80PEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
