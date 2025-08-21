// Firebase configuration for SafeGate System
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase config - credenciales reales del proyecto SafeGate
const firebaseConfig = {
  apiKey: "AIzaSyC0GH4ijTwOns7Gxv5LrP3MxaJoc7jkRk8",
  authDomain: "safegate-system.firebaseapp.com",
  projectId: "safegate-system",
  storageBucket: "safegate-system.firebasestorage.app",
  messagingSenderId: "530344581834",
  appId: "1:530344581834:web:0c8875d5677f9665b7f233",
  measurementId: "G-3ECN4HQG98"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log('🔧 Inicializando Firebase...');

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

console.log('✅ Firebase inicializado correctamente');
console.log('🔥 Servicios de Firebase listos');

export { app, db, auth };