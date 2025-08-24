// js/main.js
import { db } from './client.js';
// Importa as funções do Firestore necessárias para buscar dados
import { collection, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Importa os componentes HTML
import { AboutSectionHTML } from './components/AboutSection.js';
import { ContactSectionHTML } from './components/ContactSection.js';
import { FooterHTML } from './components/Footer.js';
import { GallerySectionHTML } from './components/GallerySection.js';
import { HeroSectionHTML } from './components/HeroSection.js';
import { HomePageGalleryCarouselHTML } from './components/HomePageGalleryCarousel.js';
import { NavbarHTML } from './components/Navbar.js';
import { ServicesSectionHTML } from './components/ServicesSection.js';
import { TestimonialsSectionHTML } from './components/TestimonialsSection.js';

// --- 1. BUSCA DE DADOS (Atualizado para Firestore) ---
async function fetchAllData() {
    try {
        // Função auxiliar para buscar todos os documentos de uma coleção
        const fetchCollection = async (collectionName) => {
            const querySnapshot = await getDocs(collection(db, collectionName));
            // Mapeia os documentos para um array de objetos, incluindo o ID de cada um
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };

        // Função para buscar o documento único de configuração
        const fetchConfig = async () => {
            // O documento de configuração precisa ter um ID fixo, por exemplo "main_config"
            const docRef = doc(db, "site_config", "main_config"); 
            const docSnap = await getDoc(docRef);
            // Retorna os dados do documento se ele existir
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        };

        // Executa todas as buscas de dados em paralelo para otimizar o carregamento
        const [
            configData, 
            servicosData, 
            galeriaData, 
            testimonialsData
        ] = await Promise.all([
            fetchConfig(),
            fetchCollection('servicos'),
            fetchCollection('galeria_imagens'),
            fetchCollection('testimonials')
        ]);

        return {
            config: configData,
            servicos: servicosData,
            galeria: galeriaData,
            testimonials: testimonialsData
        };
    } catch (error) {
        console.error("Erro ao buscar dados do site no Firestore:", error);
        // Retorna null para que a interface possa exibir uma mensagem de erro
        return null;
    }
}

// --- 2. ROTEAMENTO E RENDERIZAÇÃO (Lógica inalterada) ---
function setupRouter(data) {
    if (!data || !data.config) {
        document.getElementById('app').innerHTML = `<p class="text-center text-red-500 py-20">Erro ao carregar o conteúdo do site. Tente novamente mais tarde.</p>`;
        return;
    }

    const routes = {
        '#inicio': () => `
            ${HeroSectionHTML(data.config, data.galeria)}
            ${TestimonialsSectionHTML(data.testimonials)}
            ${HomePageGalleryCarouselHTML(data.galeria)}
        `,
        '#servicos': () => ServicesSectionHTML(data.servicos),
        '#galeria': () => GallerySectionHTML(data.galeria),
        '#sobre': () => AboutSectionHTML(data.config),
        '#contato': () => ContactSectionHTML(),
    };

    function router() {
        const path = window.location.hash || '#inicio';
        const renderFunction = routes[path];
        const pageContentContainer = document.getElementById('page-content');

        if (pageContentContainer && renderFunction) {
            pageContentContainer.innerHTML = renderFunction();
            
            if (path === '#inicio' || path === '') {
                startHeroCarousel();
                startTestimonialsCarousel();
            }

            lucide.createIcons();
        }
    }
    
    document.title = data.config.site_name;
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        ${NavbarHTML(data.config)}
        <main id="page-content"></main>
        ${FooterHTML(data.config)}
    `;

    addEventListeners();
    window.addEventListener('hashchange', router);
    router();
}

// --- 3. LÓGICA DO CARROSSEL E EVENTOS (Lógica inalterada) ---
function startHeroCarousel() {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    
    let currentIndex = 0;
    const slides = carousel.children;
    const totalSlides = slides.length;

    if (totalSlides <= 1) return;

    if (carousel.dataset.intervalId) {
        clearInterval(parseInt(carousel.dataset.intervalId));
    }

    const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 5000);

    carousel.dataset.intervalId = intervalId;
}

function startTestimonialsCarousel() {
    const carousel = document.getElementById('testimonial-carousel-slides');
    if (!carousel) return;

    let currentIndex = 0;
    const slides = carousel.children;
    const totalSlides = slides.length;

    if (totalSlides <= 1) return;

    if (carousel.dataset.intervalId) {
        clearInterval(parseInt(carousel.dataset.intervalId));
    }

    const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 6000);

    carousel.dataset.intervalId = intervalId;
}


function addEventListeners() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileMenuButton) {
        const menuIconOpen = document.getElementById('menu-icon-open');
        const menuIconClose = document.getElementById('menu-icon-close');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIconOpen.classList.toggle('hidden');
            menuIconClose.classList.toggle('hidden');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
}

// Função de inicialização da aplicação
async function initializeApp() {
    const data = await fetchAllData();
    setupRouter(data);
}

// Evento que dispara a inicialização quando o DOM está pronto
document.addEventListener('DOMContentLoaded', initializeApp);
