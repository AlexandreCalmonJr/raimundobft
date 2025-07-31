import { supabase } from './client.js';
import { AboutSectionHTML } from './components/AboutSection.js';
import { ContactSectionHTML } from './components/ContactSection.js';
import { FooterHTML } from './components/Footer.js';
import { GallerySectionHTML } from './components/GallerySection.js';
import { HeroSectionHTML } from './components/HeroSection.js';
import { HomePageGalleryCarouselHTML } from './components/HomePageGalleryCarousel.js';
import { NavbarHTML } from './components/Navbar.js';
import { ServicesSectionHTML } from './components/ServicesSection.js';
import { TestimonialsSectionHTML } from './components/TestimonialsSection.js';

// --- 1. BUSCA DE DADOS ---
async function fetchAllData() {
    try {
        const [
            { data: configData, error: configError },
            { data: servicosData, error: servicosError },
            { data: categoriasData, error: categoriasError },
            { data: itensData, error: itensError },
            { data: galeriaData, error: galeriaError },
            { data: testimonialsData, error: testimonialsError }
        ] = await Promise.all([
            supabase.from('site_config').select('*').single(),
            supabase.from('servicos').select('*'),
            supabase.from('cardapio_categorias').select('*'),
            supabase.from('cardapio_itens').select('*'),
            supabase.from('galeria_imagens').select('*'),
            supabase.from('testimonials').select('*')
        ]);

        if (configError || servicosError || categoriasError || itensError || galeriaError || testimonialsError) {
            throw new Error('Erro ao buscar um dos conjuntos de dados.');
        }

        return {
            config: configData,
            servicos: servicosData,
            categorias: categoriasData,
            itens: itensData,
            galeria: galeriaData,
            testimonials: testimonialsData
        };
    } catch (error) {
        console.error("Erro ao buscar dados do site:", error);
        return null;
    }
}

// --- 2. ROTEAMENTO E RENDERIZAÇÃO ---
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

// --- 3. LÓGICA DO CARROSSEL E EVENTOS ---
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

async function initializeApp() {
    const data = await fetchAllData();
    setupRouter(data);
}

document.addEventListener('DOMContentLoaded', initializeApp);
