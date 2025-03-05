// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDnhm7ZfnBkRzCSZ7GOc5YHQBInPJbyHhU",
    authDomain: "marathontrainingapp-1c6a5.firebaseapp.com",
    projectId: "marathontrainingapp-1c6a5",
    storageBucket: "marathontrainingapp-1c6a5.firebasestorage.app",
    messagingSenderId: "775480458151",
    appId: "1:775480458151:web:3878fba3a86fef0d791482",
    measurementId: "G-CPKL4DL75J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
