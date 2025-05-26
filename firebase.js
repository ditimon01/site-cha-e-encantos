// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyBSkzmG4PkefRFdvmDQopUlibyhonBI0t4",
    authDomain: "site-cha-e-encantos.firebaseapp.com",
    projectId: "site-cha-e-encantos",
    storageBucket: "site-cha-e-encantos.firebasestorage.app",
    messagingSenderId: "983006416430",
    appId: "1:983006416430:web:8dbba5a8f82aacd19f59bf",
    measurementId: "G-2N72DMR5F8"
  };

// Inicializa o Firebase
export const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
export const db = getFirestore(app);


