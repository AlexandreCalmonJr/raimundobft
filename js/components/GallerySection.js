export function GallerySectionHTML(imagens) {
    // Agrupa as imagens por categoria
    const groupedImages = (imagens || []).reduce((acc, img) => {
        const category = img.category || 'Geral';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(img);
        return acc;
    }, {});

    return `
        <section id="galeria" class="py-20 bg-gray-50">
            <div class="container mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Galeria de Eventos</h2>
                ${Object.entries(groupedImages).map(([category, images]) => `
                    <div class="mb-12">
                        <h3 class="text-2xl font-semibold text-gray-700 mb-6 text-center md:text-left">${category}</h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            ${images.map(img => `
                                <a href="${img.image_url}" data-lightbox="${category}" data-title="${img.alt_text || ''}">
                                    <div class="overflow-hidden rounded-lg shadow-lg">
                                        <img 
                                          src="${img.image_url}" 
                                          alt="${img.alt_text || 'Evento'}" 
                                          class="w-full h-48 object-cover transform hover:scale-110 transition-transform duration-500"
                                          onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Imagem+Indisponível';"
                                        />
                                    </div>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}
