// admin/login.js
import { auth } from './client.js';
// Importa a função de login do Firebase Auth
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Adiciona o evento de submit ao formulário de login
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
        // Tenta fazer o login com o Firebase
        await signInWithEmailAndPassword(auth, email, password);
        // Se o login for bem-sucedido, redireciona para o painel
        window.location.href = './index.html';
    } catch (error) {
        // Se houver um erro, exibe uma mensagem
        errorMessage.textContent = 'Email ou senha inválidos. Tente novamente.';
        errorMessage.classList.remove('hidden');
        console.error("Erro de login:", error.message);
    }
});
