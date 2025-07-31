// admin/pages/config.js
import { supabase } from '../client.js';

let currentConfig = {};

// Função principal que renderiza a página
export async function renderConfigPage(contentContainer) {
    // Busca a configuração atual (deve haver apenas uma linha na tabela)
    const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single(); // .single() pega apenas um registro

    if (error) {
        console.error('Erro ao buscar configurações:', error);
        contentContainer.innerHTML = `<p class="text-red-500">Não foi possível carregar as configurações.</p>`;
        return;
    }

    currentConfig = data;

    // Monta o formulário com os dados atuais
    contentContainer.innerHTML = `
        <form id="config-form" class="space-y-8 bg-white p-8 rounded-lg shadow-md">
            
            <!-- Seção de Identidade do Site -->
            <div>
                <h3 class="text-xl font-semibold mb-4 border-b pb-2">Identidade do Site</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="site_name" class="block text-sm font-medium text-gray-700">Nome do Site</label>
                        <input type="text" id="site_name" value="${currentConfig.site_name || ''}" class="mt-1 block w-full p-2 border rounded-md">
                    </div>
                    <div>
                        <label for="site_icon" class="block text-sm font-medium text-gray-700">Ícone de Fallback (Lucide)</label>
                        <input type="text" id="site_icon" value="${currentConfig.site_icon || ''}" class="mt-1 block w-full p-2 border rounded-md">
                    </div>
                </div>
                <div class="mt-6">
                    <label for="logo_image" class="block text-sm font-medium text-gray-700">Logotipo (PNG/SVG)</label>
                    <input type="file" id="logo_image" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    <div class="mt-4">
                        <p class="text-xs text-gray-500 mb-2">Pré-visualização:</p>
                        <img src="${currentConfig.logo_url || 'https://placehold.co/200x80?text=Logo'}" id="logo-preview" class="h-16 w-auto bg-gray-200 p-2 rounded-md shadow-sm"/>
                    </div>
                </div>
            </div>

            <!-- Seção de Aparência -->
            <div>
                <h3 class="text-xl font-semibold mb-4 border-b pb-2">Aparência e Cores</h3>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label for="primary_color" class="block text-sm font-medium text-gray-700">Cor Principal</label>
                            <input type="color" id="primary_color" value="${currentConfig.primary_color || '#f59e0b'}" class="mt-1 block w-20 h-10 p-1 border rounded-md">
                        </div>
                        <div>
                            <label for="button_color" class="block text-sm font-medium text-gray-700">Cor dos Botões</label>
                            <input type="color" id="button_color" value="${currentConfig.button_color || '#1d4ed8'}" class="mt-1 block w-20 h-10 p-1 border rounded-md">
                        </div>
                         <div>
                            <label for="font_family" class="block text-sm font-medium text-gray-700">Fonte (Google Fonts)</label>
                            <input type="text" id="font_family" value="${currentConfig.font_family || 'Inter'}" placeholder="Ex: Roboto" class="mt-1 block w-full p-2 border rounded-md">
                        </div>
                    </div>
                    <div>
                        <label for="hero_image" class="block text-sm font-medium text-gray-700">Imagem Principal (Hero)</label>
                        <input type="file" id="hero_image" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                        <img src="${currentConfig.hero_image_url || 'https://placehold.co/600x400'}" id="hero-preview" class="mt-4 w-48 h-auto rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label for="hero_title" class="block text-sm font-medium text-gray-700">Título Principal (Hero)</label>
                        <input type="text" id="hero_title" value="${currentConfig.hero_title || ''}" class="mt-1 block w-full p-2 border rounded-md">
                    </div>
                     <div>
                        <label for="hero_subtitle" class="block text-sm font-medium text-gray-700">Subtítulo Principal (Hero)</label>
                        <textarea id="hero_subtitle" rows="2" class="mt-1 block w-full p-2 border rounded-md">${currentConfig.hero_subtitle || ''}</textarea>
                    </div>
                </div>
            </div>

            <!-- Seção Sobre Nós -->
            <div>
                <h3 class="text-xl font-semibold mb-4 border-b pb-2">Seção "Sobre Nós"</h3>
                <div class="space-y-4">
                    <div>
                        <label for="about_title" class="block text-sm font-medium text-gray-700">Título da Seção</label>
                        <input type="text" id="about_title" value="${currentConfig.about_title || ''}" class="mt-1 block w-full p-2 border rounded-md">
                    </div>
                    <div>
                        <label for="about_description_p1" class="block text-sm font-medium text-gray-700">Primeiro Parágrafo</label>
                        <textarea id="about_description_p1" rows="3" class="mt-1 block w-full p-2 border rounded-md">${currentConfig.about_description_p1 || ''}</textarea>
                    </div>
                    <div>
                        <label for="about_description_p2" class="block text-sm font-medium text-gray-700">Segundo Parágrafo</label>
                        <textarea id="about_description_p2" rows="3" class="mt-1 block w-full p-2 border rounded-md">${currentConfig.about_description_p2 || ''}</textarea>
                    </div>
                    <div>
                        <label for="about_image" class="block text-sm font-medium text-gray-700">Imagem da Seção</label>
                        <input type="file" id="about_image" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                        <img src="${currentConfig.about_image_url || 'https://placehold.co/600x400'}" id="about-preview" class="mt-4 w-48 h-auto rounded-md shadow-sm"/>
                    </div>
                </div>
            </div>

            <!-- Seção do Rodapé e Contato -->
            <div>
                <h3 class="text-xl font-semibold mb-4 border-b pb-2">Rodapé, Contato e Redes Sociais</h3>
                <div class="space-y-4">
                     <div>
                        <label for="footer_text" class="block text-sm font-medium text-gray-700">Texto do Rodapé</label>
                        <input type="text" id="footer_text" value="${currentConfig.footer_text || ''}" class="mt-1 block w-full p-2 border rounded-md">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label for="contact_email" class="block text-sm font-medium text-gray-700">Email de Contato</label>
                            <input type="email" id="contact_email" value="${currentConfig.contact_email || ''}" class="mt-1 block w-full p-2 border rounded-md">
                        </div>
                        <div>
                            <label for="contact_phone" class="block text-sm font-medium text-gray-700">Telefone de Contato</label>
                            <input type="tel" id="contact_phone" value="${currentConfig.contact_phone || ''}" class="mt-1 block w-full p-2 border rounded-md">
                        </div>
                        <div>
                            <label for="contact_address" class="block text-sm font-medium text-gray-700">Endereço</label>
                            <input type="text" id="contact_address" value="${currentConfig.contact_address || ''}" class="mt-1 block w-full p-2 border rounded-md">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label for="social_facebook_url" class="block text-sm font-medium text-gray-700">URL do Facebook</label>
                            <input type="url" id="social_facebook_url" value="${currentConfig.social_facebook_url || ''}" class="mt-1 block w-full p-2 border rounded-md">
                        </div>
                        <div>
                            <label for="social_instagram_url" class="block text-sm font-medium text-gray-700">URL do Instagram</label>
                            <input type="url" id="social_instagram_url" value="${currentConfig.social_instagram_url || ''}" class="mt-1 block w-full p-2 border rounded-md">
                        </div>
                        <div>
                            <label for="social_linkedin_url" class="block text-sm font-medium text-gray-700">URL do LinkedIn</label>
                            <input type="url" id="social_linkedin_url" value="${currentConfig.social_linkedin_url || ''}" class="mt-1 block w-full p-2 border rounded-md">
                        </div>
                    </div>
                     <div>
                        <label for="creator_name" class="block text-sm font-medium text-gray-700">Nome do Criador do Site</label>
                        <input type="text" id="creator_name" value="${currentConfig.creator_name || ''}" class="mt-1 block w-full p-2 border rounded-md">
                    </div>
                </div>
            </div>
            
            <!-- Botão de Salvar -->
            <div class="flex justify-end pt-4">
                <button type="submit" class="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg">
                    Salvar Alterações
                </button>
            </div>
        </form>
    `;

    addPageEventListeners();
}

// Adiciona os eventos da página
function addPageEventListeners() {
    document.getElementById('config-form').addEventListener('submit', handleSaveConfig);

    // Função para criar preview de imagem
    function setupImagePreview(inputId, previewId) {
        const imageInput = document.getElementById(inputId);
        if (imageInput) {
            imageInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById(previewId).src = e.target.result;
                    }
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    setupImagePreview('hero_image', 'hero-preview');
    setupImagePreview('about_image', 'about-preview');
    setupImagePreview('logo_image', 'logo-preview');
}

// Função para fazer upload de uma imagem e retornar a URL
async function uploadImage(file, bucket, namePrefix) {
    try {
        const fileName = `${namePrefix}-${Date.now()}`;
        const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, { upsert: true });
        
        if (error) throw error;

        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
        return data.publicUrl;

    } catch (error) {
        alert(`Erro ao fazer upload da imagem (${namePrefix}): ${error.message}`);
        return null;
    }
}

// Função para salvar as configurações
async function handleSaveConfig(event) {
    event.preventDefault();
    const form = event.target;
    let heroImageUrl = currentConfig.hero_image_url;
    let aboutImageUrl = currentConfig.about_image_url;
    let logoUrl = currentConfig.logo_url; // <-- CORREÇÃO: Esta linha foi adicionada

    // 1. Verifica se novas imagens foram enviadas e faz o upload
    const logoImageFile = form.logo_image.files[0];
    if (logoImageFile) {
        logoUrl = await uploadImage(logoImageFile, 'galeria', 'logo');
        if (!logoUrl) return;
    }

    const heroImageFile = form.hero_image.files[0];
    if (heroImageFile) {
        heroImageUrl = await uploadImage(heroImageFile, 'galeria', 'hero');
        if (!heroImageUrl) return; // Para a execução se o upload falhar
    }

    const aboutImageFile = form.about_image.files[0];
    if (aboutImageFile) {
        aboutImageUrl = await uploadImage(aboutImageFile, 'galeria', 'about');
        if (!aboutImageUrl) return; // Para a execução se o upload falhar
    }

    // 2. Monta o objeto com os dados a serem atualizados
    const updatedConfig = {
        site_name: form.site_name.value,
        site_icon: form.site_icon.value,
        primary_color: form.primary_color.value,
        button_color: form.button_color.value,
        font_family: form.font_family.value,
        hero_title: form.hero_title.value,
        hero_subtitle: form.hero_subtitle.value,
        footer_text: form.footer_text.value,
        contact_email: form.contact_email.value,
        contact_phone: form.contact_phone.value,
        contact_address: form.contact_address.value,
        social_facebook_url: form.social_facebook_url.value,
        social_instagram_url: form.social_instagram_url.value,
        social_linkedin_url: form.social_linkedin_url.value,
        creator_name: form.creator_name.value,
        about_title: form.about_title.value,
        about_description_p1: form.about_description_p1.value,
        about_description_p2: form.about_description_p2.value,
        hero_image_url: heroImageUrl,
        about_image_url: aboutImageUrl,
        logo_url: logoUrl
    };

    // 3. Salva os dados no banco de dados
    const { error } = await supabase
        .from('site_config')
        .update(updatedConfig)
        .eq('id', currentConfig.id);

    if (error) {
        alert('Erro ao salvar as configurações: ' + error.message);
    } else {
        alert('Configurações salvas com sucesso!');
        renderConfigPage(document.getElementById('page-content'));
    }
}