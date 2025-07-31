// admin/login.js
import { supabase } from './client.js';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Tenta fazer o login com o Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        // Se houver um erro, mostra a mensagem
        errorMessage.textContent = 'Email ou senha inválidos.';
        errorMessage.classList.remove('hidden');
    } else {
        // Se o login for bem-sucedido, redireciona para o painel
        window.location.href = './index.html';
    }
});