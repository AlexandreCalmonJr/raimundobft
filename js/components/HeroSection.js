export function HeroSectionHTML(config, galeria) {
    // Pega até 5 imagens aleatórias da galeria para o carrossel
    const randomImages = [...(galeria || [])].sort(() => 0.5 - Math.random()).slice(0, 5);
    const heroImageFallback = config.hero_image_url || 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

    return `
        <section id="inicio" class="relative h-screen w-full overflow-hidden">
            <!-- Slides do Carrossel -->
            <div id="hero-carousel" class="h-full w-full flex transition-transform duration-700 ease-in-out">
                ${randomImages.length > 0 ? randomImages.map(img => `
                    <div class="h-full w-full flex-shrink-0 bg-cover bg-center" style="background-image: url('${img.image_url}')"></div>
                `).join('') : `<div class="h-full w-full flex-shrink-0 bg-cover bg-center" style="background-image: url('${heroImageFallback}')"></div>`}
            </div>
            
            <!-- Overlay e Conteúdo -->
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white p-4">
                 <div class="text-center max-w-4xl">
                    <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight shadow-text">${config.hero_title}</h1>
                    <p class="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto shadow-text">${config.hero_subtitle}</p>
                    <a href="#contato" class="nav-link dynamic-button-bg text-white font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 transform hover:scale-105 inline-block">
                        Solicite um Orçamento
                    </a>
                </div>
            </div>
        </section>
    `;
}