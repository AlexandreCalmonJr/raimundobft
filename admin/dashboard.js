// admin/dashboard.js
import { supabase } from './client.js';
import { renderConfigPage } from './pages/config.js'; // <-- Adicione esta linha
import { renderGaleriaPage } from './pages/galeria.js';
import { renderServicosPage } from './pages/servicos.js';
import { renderTestimonialsPage } from './pages/testimonials.js';
// <-- Correção: Esta linha foi adicionada

// --- SELEÇÃO DE ELEMENTOS ---

const logoutButton = document.getElementById('logout-button');
const contentContainer = document.getElementById('page-content');
const pageTitle = document.querySelector('header h2');

// --- ROTEADOR DO PAINEL ---
const routes = {
    '#config': { // <-- Adicione/Atualize esta rota
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
    '#testimonials': { // <-- Adicione esta rota
        render: renderTestimonialsPage,
        title: 'Gerenciar Depoimentos'
    },
    '#cardapio': {
        render: () => contentContainer.innerHTML = '<p>Página de Cardápio em construção.</p>',
        title: 'Gerenciar Cardápio'
    }
};

function router() {
    // Define a página padrão como #config
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

// --- AUTENTICAÇÃO E EVENTOS ---
async function checkUserSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        window.location.href = './login.html';
    }
}

async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = './login.html';
}

// --- INICIALIZAÇÃO ---
checkUserSession();
logoutButton.addEventListener('click', handleLogout);
window.addEventListener('hashchange', router);
window.addEventListener('load', router);
