// Firebase Configuration and Initialization
// Este módulo inicializa Firebase con las credenciales del proyecto

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCxGHV_8Tnso0XGLBPkqTMzmMC1-L0kZYc",
    authDomain: "examen-ki-full.firebaseapp.com",
    projectId: "examen-ki-full",
    storageBucket: "examen-ki-full.firebasestorage.app",
    messagingSenderId: "589033133313",
    appId: "1:589033133313:web:272fe941022bdd576ff700",
    measurementId: "G-JKMZFP2376"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
const db = getFirestore(app);
const auth = getAuth(app);

// Exportar para uso en otros módulos
export { db, auth };
