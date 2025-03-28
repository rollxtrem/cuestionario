import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Si usas Firestore
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // Si usas autenticación

// Configuración de Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyAm-G0x7z78p_W7pqDBuO6tPBapdB2deUs",
  authDomain: "tesis-encuesta-bacteriologos.firebaseapp.com",
  projectId: "tesis-encuesta-bacteriologos",
  storageBucket: "tesis-encuesta-bacteriologos.firebasestorage.app",
  messagingSenderId: "397330858528",
  appId: "1:397330858528:web:daad7ab305c4fb95ebb245",
  measurementId: "G-29JH8LES6P"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);  // Base de datos Firestore
const auth = getAuth(app);  // Autenticación
const analytics = getAnalytics(app);

export { app, db, auth };
