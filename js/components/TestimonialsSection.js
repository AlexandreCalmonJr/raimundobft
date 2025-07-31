export function TestimonialsSectionHTML(testimonials) {
    if (!testimonials || testimonials.length === 0) {
        return ''; // Não renderiza a seção se não houver depoimentos
    }

    return `
        <section id="depoimentos" class="py-20 bg-gray-100">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-3xl md:text-4xl font-bold mb-12 text-gray-800">O que Nossos Clientes Dizem</h2>
                
                <!-- Container do Carrossel -->
                <div class="relative w-full max-w-3xl mx-auto overflow-hidden h-72 md:h-64">
                    <div id="testimonial-carousel-slides" class="h-full flex transition-transform duration-700 ease-in-out">
                        
                        <!-- Slides de Depoimentos -->
                        ${(testimonials || []).map(item => `
                            <div class="w-full h-full flex-shrink-0 flex items-center justify-center p-4">
                                <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl">
                                    <i data-lucide="quote" class="w-8 h-8 mx-auto text-gray-300 mb-4"></i>
                                    <p class="text-gray-600 italic mb-6 flex-grow">"${item.testimonial_text}"</p>
                                    <div>
                                        <p class="font-bold text-gray-800">${item.author_name}</p>
                                        <p class="text-sm text-gray-500">${item.source}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}

                    </div>
                </div>
            </div>
        </section>
    `;
}
