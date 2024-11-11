// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuLKI-Cr0Ar-bH4St4cUrHBHgaMDUj1Jc",
  authDomain: "alc-promotion-dev.firebaseapp.com",
  projectId: "alc-promotion-dev",
  storageBucket: "alc-promotion-dev.firebasestorage.app",
  messagingSenderId: "927091946306",
  appId: "1:927091946306:web:72ee24cd562c65caab8edb",
  measurementId: "G-L1JEDWG7T0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };