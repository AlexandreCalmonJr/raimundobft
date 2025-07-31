export function HomePageGalleryCarouselHTML(galeria) {
    if (!galeria || galeria.length < 4) {
        // Não renderiza a seção se não houver imagens suficientes
        return '';
    }

    // Pega até 10 imagens aleatórias para o carrossel
    const randomImages = [...galeria].sort(() => 0.5 - Math.random()).slice(0, 10);

    // Duplica as imagens para criar o efeito de loop infinito
    const allImages = [...randomImages, ...randomImages];

    return `
        <section id="home-gallery" class="py-20 bg-white overflow-hidden">
            <div class="container mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">Momentos Inesquecíveis</h2>
            </div>
            <div class="relative flex" id="home-gallery-container">
                <div class="flex-shrink-0 flex animate-marquee">
                    ${allImages.map(img => `
                        <div class="w-64 md:w-80 mx-4">
                            <div class="block overflow-hidden rounded-lg shadow-lg h-80">
                                <img src="${img.image_url}" alt="${img.alt_text || 'Evento'}" class="w-full h-full object-cover">
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
