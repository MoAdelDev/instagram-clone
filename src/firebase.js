// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5lJulVY9Iit_xtfRzEmEYK9ccV0xvUko",
  authDomain: "instagram-2da7a.firebaseapp.com",
  projectId: "instagram-2da7a",
  storageBucket: "instagram-2da7a.appspot.com",
  messagingSenderId: "202194953204",
  appId: "1:202194953204:web:d00d376f267e5c0ac14fa1",
  measurementId: "G-JXLRKG1W2Q",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage();
export { db ,auth, storage};