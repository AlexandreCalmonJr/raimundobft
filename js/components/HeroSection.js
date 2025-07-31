export function HeroSectionHTML(config, galeria) {
    // Pega até 5 imagens aleatórias da galeria para o carrossel
    const randomImages = [...(galeria || [])].sort(() => 0.5 - Math.random()).slice(0, 5);

    return `
        <section id="inicio" class="relative h-screen w-full overflow-hidden">
            <!-- Slides do Carrossel -->
            <div id="hero-carousel" class="h-full w-full flex transition-transform duration-700 ease-in-out">
                ${randomImages.length > 0 ? randomImages.map(img => `
                    <div class="h-full w-full flex-shrink-0 bg-cover bg-center" style="background-image: url('${img.image_url}')"></div>
                `).join('') : `<div class="h-full w-full flex-shrink-0 bg-cover bg-center" style="background-image: url('${config.hero_image_url}')"></div>`}
            </div>
            
            <!-- Overlay e Conteúdo -->
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                 <div class="text-center p-8">
                    <h1 class="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">${config.hero_title}</h1>
                    <p class="text-lg md:text-xl mb-8 max-w-2xl">${config.hero_subtitle}</p>
                    <a href="#contato" class="nav-link dynamic-button-bg text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 transform hover:scale-105 inline-block">
                        Solicite um Orçamento
                    </a>
                </div>
            </div>
        </section>
    `;
}
