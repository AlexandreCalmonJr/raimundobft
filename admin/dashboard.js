// admin/dashboard.js
import { auth } from './client.js';
// Importa as funções de autenticação do Firebase
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Importa as funções que renderizam cada página do painel
import { renderConfigPage } from './pages/config.js';
import { renderGaleriaPage } from './pages/galeria.js';
import { renderServicosPage } from './pages/servicos.js';
import { renderTestimonialsPage } from './pages/testimonials.js';

// --- SELEÇÃO DE ELEMENTOS ---
const logoutButton = document.getElementById('logout-button');
const contentContainer = document.getElementById('page-content');
const pageTitle = document.querySelector('header h2');

// --- ROTEADOR DO PAINEL (Lógica inalterada) ---
const routes = {
    '#config': {
        render: renderConfigPage,
        title: 'Configurações Gerais'
    },
    '#servicos': {
        render: renderServicosPage,
        title: 'Gerenciar Serviços'
    },
    '#galeria': {
        render: renderGaleriaPage,
        title: 'Gerenciar Galeria'
    },
    '#testimonials': {
        render: renderTestimonialsPage,
        title: 'Gerenciar Depoimentos'
    },
    '#cardapio': {
        render: () => contentContainer.innerHTML = '<p>Página de Cardápio em construção.</p>',
        title: 'Gerenciar Cardápio'
    }
};

function router() {
    const path = window.location.hash || '#config'; 
    const route = routes[path];

    if (route && contentContainer) {
        pageTitle.textContent = route.title;
        route.render(contentContainer);
        updateActiveLink(path);
    } else {
        pageTitle.textContent = "Página não encontrada";
        contentContainer.innerHTML = '<p>A página que você tentou acessar não existe.</p>';
    }
}

function updateActiveLink(path) {
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('bg-gray-700');
        } else {
            link.classList.remove('bg-gray-700');
        }
    });
}

// --- AUTENTICAÇÃO E EVENTOS (Atualizado para Firebase) ---
// Verifica a sessão do usuário em tempo real
function checkUserSession() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Se não houver usuário logado, redireciona para a página de login
            window.location.href = './login.html';
        }
    });
}

// Função para fazer logout
async function handleLogout() {
    try {
        await signOut(auth);
        // Redireciona para a página de login após o logout
        window.location.href = './login.html';
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert('Não foi possível sair. Tente novamente.');
    }
}

// --- INICIALIZAÇÃO ---
checkUserSession(); // Verifica a sessão assim que o script carrega
logoutButton.addEventListener('click', handleLogout);
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
