export function AboutSectionHTML(config) {
  const aboutImage = config.about_image_url || 'https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  return `
      <section id="sobre" class="py-20 bg-white">
          <div class="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
              <div class="md:w-1/2">
                  <img 
                    src="${aboutImage}" 
                    alt="Nossa Equipe" 
                    class="rounded-lg shadow-xl w-full"
                    onerror="this.onerror=null;this.src='https://placehold.co/600x400/cccccc/ffffff?text=Nossa+Equipe';"
                  />
              </div>
              <div class="md:w-1/2 text-center md:text-left">
                  <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800">${config.about_title}</h2>
                  <p class="text-gray-600 mb-4">${config.about_description_p1}</p>
                  <p class="text-gray-600">${config.about_description_p2}</p>
              </div>
          </div>
      </section>
  `;
}
