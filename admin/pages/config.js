// admin/pages/config.js
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { db } from '../client.js';

let currentConfig = {};

// Função para fazer upload de uma imagem para o ImgBB
async function uploadImageToImgBB(file) {
    if (!file) return null;
    
    // --- ATENÇÃO ---
    // Substitua pela sua chave de API do ImgBB
    const apiKey = '0b000b4a3a0aabcdc2aae02ae80ed767';
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (result.success) {
            return result.data.url; // Retorna a URL da imagem
        } else {
            throw new Error(result.error.message);
        }
    } catch (error) {
        alert(`Erro ao fazer upload da imagem: ${error.message}`);
        return null;
    }
}


// Função principal que renderiza a página
export async function renderConfigPage(contentContainer) {
    const docRef = doc(db, 'site_config', 'main_config');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.error('Documento de configuração não encontrado!');
        contentContainer.innerHTML = `<p class="text-red-500">Documento de configuração não encontrado no Firestore. Crie um documento com o ID 'main_config' na coleção 'site_config'.</p>`;
        return;
    }

    currentConfig = { id: docSnap.id, ...docSnap.data() };

    // O HTML do formulário continua o mesmo
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
                        <label for="about_image" class="block text-sm font-medium text-gray-700">Imagem da Seção</label>
                        <input type="file" id="about_image" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                        <img src="${currentConfig.about_image_url || 'https://placehold.co/600x400'}" id="about-preview" class="mt-4 w-48 h-auto rounded-md shadow-sm"/>
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

    function setupImagePreview(inputId, previewId) {
        document.getElementById(inputId).addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                document.getElementById(previewId).src = URL.createObjectURL(file);
            }
        });
    }

    setupImagePreview('hero_image', 'hero-preview');
    setupImagePreview('about_image', 'about-preview');
    setupImagePreview('logo_image', 'logo-preview');
}

// Função para salvar as configurações
async function handleSaveConfig(event) {
    event.preventDefault();
    const form = event.target;
    
    // Mostra um feedback visual de que o salvamento começou
    const saveButton = form.querySelector('button[type="submit"]');
    saveButton.textContent = 'Salvando...';
    saveButton.disabled = true;

    try {
        // Faz o upload das imagens SE novos arquivos foram selecionados
        const logoUrl = await uploadImageToImgBB(form.logo_image.files[0]);
        const heroImageUrl = await uploadImageToImgBB(form.hero_image.files[0]);
        const aboutImageUrl = await uploadImageToImgBB(form.about_image.files[0]);

        // Monta o objeto com os dados a serem atualizados
        const updatedConfig = {
            site_name: form.site_name.value,
            site_icon: form.site_icon.value,
            hero_title: form.hero_title.value,
            hero_subtitle: form.hero_subtitle.value,
            // Mantém a URL antiga se nenhuma nova imagem foi enviada
            logo_url: logoUrl || currentConfig.logo_url,
            hero_image_url: heroImageUrl || currentConfig.hero_image_url,
            about_image_url: aboutImageUrl || currentConfig.about_image_url,
        };

        // Salva os dados no Firestore
        const docRef = doc(db, 'site_config', currentConfig.id);
        await updateDoc(docRef, updatedConfig);

        alert('Configurações salvas com sucesso!');
    } catch (error) {
        alert('Erro ao salvar as configurações: ' + error.message);
    } finally {
        // Restaura o botão ao estado original
        saveButton.textContent = 'Salvar Alterações';
        saveButton.disabled = false;
        // Recarrega a página para mostrar os dados atualizados
        renderConfigPage(document.getElementById('page-content'));
    }
}
