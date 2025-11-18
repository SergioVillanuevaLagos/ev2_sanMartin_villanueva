// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZlU3r-tTSsZL0Cd8IcfEmxzm-ZHRuQd0",
  authDomain: "actividad-4-ac262.firebaseapp.com",
  projectId: "actividad-4-ac262",
  storageBucket: "actividad-4-ac262.firebasestorage.app",
  messagingSenderId: "540653958263",
  appId: "1:540653958263:web:85a470c75c566961480272",
  measurementId: "G-3H0JCTLBME",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);