export function FooterHTML(config) {
    return `
        <footer class="bg-gray-800 text-white py-12">
            <div class="container mx-auto px-6 text-center">
                <div class="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h4 class="text-lg font-bold mb-3">${config.site_name || 'Buffet Sabor & Arte'}</h4>
                        <p class="text-gray-400">${config.footer_text || 'Realizando sonhos, um prato de cada vez.'}</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-3">Contato Rápido</h4>
                        <ul class="space-y-2 text-gray-400">
                            ${config.contact_email ? `<li class="flex items-center justify-center space-x-2 hover:text-amber-400"><i data-lucide="mail" class="w-4 h-4"></i><a href="mailto:${config.contact_email}">${config.contact_email}</a></li>` : ''}
                            ${config.contact_phone ? `<li class="flex items-center justify-center space-x-2 hover:text-amber-400"><i data-lucide="phone" class="w-4 h-4"></i><a href="tel:${config.contact_phone}">${config.contact_phone}</a></li>` : ''}
                            ${config.contact_address ? `<li class="flex items-center justify-center space-x-2"><i data-lucide="map-pin" class="w-4 h-4"></i><span>${config.contact_address}</span></li>` : ''}
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold mb-3">Siga-nos</h4>
                        <div class="flex justify-center space-x-4">
                            ${config.social_facebook_url ? `<a href="${config.social_facebook_url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-amber-400">Facebook</a>` : ''}
                            ${config.social_instagram_url ? `<a href="${config.social_instagram_url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-amber-400">Instagram</a>` : ''}
                            ${config.social_linkedin_url ? `<a href="${config.social_linkedin_url}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-amber-400">LinkedIn</a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="border-t border-gray-700 pt-8 relative">
                    <p class="text-gray-500">&copy; ${new Date().getFullYear()} ${config.site_name || 'Buffet Sabor & Arte'}. Todos os direitos reservados. 
                    ${config.creator_name ? `<span>Desenvolvido por ${config.creator_name}</span>` : ''}
                    </p>
                    <a href="./admin/login.html" class="absolute bottom-0 right-0 text-gray-600 hover:text-amber-400 p-2" title="Login Administrativo">
                        <i data-lucide="log-in" class="w-4 h-4"></i>
                    </a>
                </div>
            </div>
        </footer>
    `;
}
