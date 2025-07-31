// js/components/ServicesSection.js
export function ServicesSectionHTML(servicos) {
    return `
        <section id="servicos" class="py-20 bg-gray-50">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Nossos Serviços</h2>
                <p class="text-gray-600 mb-12 max-w-3xl mx-auto">Oferecemos soluções completas de buffet para todos os tipos de eventos, com cardápios flexíveis e serviço de alta qualidade.</p>
                <div class="grid md:grid-cols-3 gap-8">
                    ${(servicos || []).map(service => `
                        <div class="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
                            <div class="flex justify-center mb-4">
                                <i data-lucide="${service.icon}" class="w-12 h-12 text-amber-500"></i>
                            </div>
                            <h3 class="text-xl font-bold mb-3 text-gray-900">${service.title}</h3>
                            <p class="text-gray-600">${service.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
