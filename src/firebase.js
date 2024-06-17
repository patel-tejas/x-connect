// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY ,
  authDomain: "x-connect-5e21c.firebaseapp.com",
  projectId: "x-connect-5e21c",
  storageBucket: "x-connect-5e21c.appspot.com",
  messagingSenderId: "843169196011",
  appId: "1:843169196011:web:7aa0d7a119f541767e1bae",
  measurementId: "G-VMBNGFLP7N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

