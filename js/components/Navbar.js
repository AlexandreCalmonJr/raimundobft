export function NavbarHTML(config) {
  const navLinks = ["Início", "Serviços", "Galeria", "Sobre", "Contato"]; // "Depoimentos" removido
  const slugify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return `
      <nav class="bg-white/80 backdrop-blur-md shadow-md fixed w-full top-0 z-50">
        <div class="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="#inicio" class="flex items-center space-x-2 text-xl font-bold text-gray-800">
            ${config.logo_url 
              ? `<img src="${config.logo_url}" alt="${config.site_name}" class="h-10 w-auto">`
              : `<i data-lucide="${config.site_icon || 'chef-hat'}" style="color: ${config.primary_color};"></i><span>${config.site_name || 'Buffet Sabor & Arte'}</span>`
            }
          </a>
          <div class="hidden md:flex space-x-6">
            ${navLinks.map(link => `<a href="#${slugify(link)}" class="nav-link text-gray-600 hover:text-amber-500 transition-colors duration-300">${link}</a>`).join('')}
          </div>
          <div class="md:hidden">
            <button id="mobile-menu-button" class="text-gray-600 focus:outline-none">
               <i data-lucide="menu" id="menu-icon-open"></i>
               <i data-lucide="x" id="menu-icon-close" class="hidden"></i>
            </button>
          </div>
        </div>
        <div id="mobile-menu" class="hidden md:hidden bg-white shadow-lg">
          ${navLinks.map(link => `<a href="#${slugify(link)}" class="nav-link block px-6 py-3 text-gray-600 hover:bg-amber-100 hover:text-amber-600">${link}</a>`).join('')}
        </div>
      </nav>
  `;
}
