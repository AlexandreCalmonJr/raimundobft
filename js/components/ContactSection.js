export function ContactSectionHTML() {
    return `
        <section id="contato" class="py-20 bg-amber-50">
            <div class="container mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Entre em Contato</h2>
                <div class="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl">
                    <form action="https://formspree.io/f/your_form_id" method="POST">
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <input type="text" name="name" placeholder="Seu Nome" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                            <input type="email" name="email" placeholder="Seu E-mail" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                        </div>
                        <div class="grid md:grid-cols-2 gap-6 mb-6">
                            <input type="tel" name="phone" placeholder="Seu Telefone" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <input type="text" name="event_type" placeholder="Tipo de Evento" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                        </div>
                        <textarea name="message" placeholder="Mensagem (inclua data e número de convidados)" rows="5" class="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500" required></textarea>
                        <div class="text-center">
                            <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-12 rounded-full transition-transform duration-300 transform hover:scale-105">
                              Enviar Pedido
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    `;
}