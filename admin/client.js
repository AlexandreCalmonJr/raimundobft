// js/client.js
// Remove a importação do Supabase e adiciona a do Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// --- ATENÇÃO ---
// Substitua o objeto abaixo pelas credenciais do seu projeto Firebase.
// Você pode encontrá-las no Console do Firebase em:
// Configurações do Projeto > Geral > Seus apps > App da Web > Configuração do SDK
const firebaseConfig = {
    apiKey: "AIzaSyC2iT1whsWnjOqpCFM4IaM-rlkrbRFSUX4",
    authDomain: "raimundos-bft.firebaseapp.com",
    projectId: "raimundos-bft",
    storageBucket: "raimundos-bft.firebasestorage.app",
    messagingSenderId: "665108355675",
    appId: "1:665108355675:web:4d3cf1f5123f647dcf7d7e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços do Firebase que serão utilizados no projeto
export const db = getFirestore(app);
export const auth = getAuth(app);
