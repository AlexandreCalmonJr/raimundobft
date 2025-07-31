// js/components/MenuSection.js
export function MenuSectionHTML(categorias, itens) {
    // Agrupa os itens por categoria
    const menuCompleto = (categorias || []).map(cat => ({
        ...cat,
        itens: (itens || []).filter(item => item.category_id === cat.id)
    }));

    return `
        <section id="cardapio" class="py-20 bg-white">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Nosso Cardápio</h2>
                <p class="text-gray-600 mb-12 max-w-3xl mx-auto">Uma amostra das delícias que podemos oferecer. Criamos menus personalizados para atender perfeitamente ao seu evento.</p>
                <div class="grid md:grid-cols-3 gap-8 text-left">
                    ${menuCompleto.map(categoria => `
                        <div class="bg-gray-50 p-6 rounded-lg shadow-md">
                            <h3 class="text-2xl font-semibold mb-4 text-amber-600 flex items-center">
                                <i data-lucide="${categoria.icon}" class="mr-3"></i>
                                ${categoria.name}
                            </h3>
                            <ul class="space-y-2 list-disc list-inside">
                                ${categoria.itens.map(item => `<li class="text-gray-700">${item.name}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
