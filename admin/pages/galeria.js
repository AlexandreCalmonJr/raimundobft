// admin/pages/galeria.js
import { supabase } from '../client.js';

// Função principal que renderiza a página da galeria
export async function renderGaleriaPage(contentContainer) {
    const { data: imagens, error } = await supabase
        .from('galeria_imagens')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar imagens:', error);
        contentContainer.innerHTML = `<p class="text-red-500">Não foi possível carregar as imagens.</p>`;
        return;
    }

    contentContainer.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold">Imagens da Galeria</h2>
            <button id="add-image-btn" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Adicionar Imagem
            </button>
        </div>
        <div id="gallery-grid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            ${(imagens || []).map(img => `
                <div class="relative group" data-id="${img.id}">
                    <img src="${img.image_url}" alt="${img.alt_text}" class="w-full h-40 object-cover rounded-lg shadow-md">
                    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <button class="delete-btn text-white" title="Excluir Imagem">
                            <i data-lucide="trash-2" class="w-8 h-8"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    lucide.createIcons();
    addPageEventListeners();
}

// Adiciona os eventos da página
function addPageEventListeners() {
    document.getElementById('add-image-btn').addEventListener('click', openUploadModal);

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.closest('.group').dataset.id;
            if (confirm('Tem certeza que deseja excluir esta imagem? A ação não pode ser desfeita.')) {
                await deleteImage(id);
            }
        });
    });
}

// Abre o modal de upload
function openUploadModal() {
    const modalHTML = `
        <div id="upload-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 class="text-2xl font-bold mb-4">Adicionar Nova Imagem</h2>
                <form id="upload-form">
                    <div class="mb-4">
                        <label for="image-file" class="block text-gray-700">Arquivo da Imagem</label>
                        <input type="file" id="image-file" accept="image/*" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label for="alt-text" class="block text-gray-700">Texto Alternativo (Descrição)</label>
                        <input type="text" id="alt-text" class="w-full p-2 border rounded" placeholder="Ex: Casal se beijando no casamento">
                    </div>
                     <div class="mb-4">
                        <label for="category" class="block text-gray-700">Categoria</label>
                        <input type="text" id="category" class="w-full p-2 border rounded" value="Geral">
                    </div>
                    <div id="upload-status" class="hidden mb-4 text-blue-600"></div>
                    <div class="flex justify-end gap-4">
                        <button type="button" id="cancel-btn" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                        <button type="submit" id="submit-upload-btn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('upload-form').addEventListener('submit', handleUpload);
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('upload-modal').remove();
    });
}

// Lida com o processo de upload
async function handleUpload(event) {
    event.preventDefault();
    const fileInput = document.getElementById('image-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
    }

    const statusDiv = document.getElementById('upload-status');
    const submitButton = document.getElementById('submit-upload-btn');
    statusDiv.textContent = 'Enviando imagem...';
    statusDiv.classList.remove('hidden');
    submitButton.disabled = true;

    try {
        // 1. Faz o upload do arquivo para o Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('galeria') // Nome do seu bucket
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Pega a URL pública da imagem enviada
        const { data: urlData } = supabase
            .storage
            .from('galeria')
            .getPublicUrl(fileName);

        const publicURL = urlData.publicUrl;

        // 3. Salva as informações da imagem no banco de dados
        const imageData = {
            image_url: publicURL,
            alt_text: document.getElementById('alt-text').value,
            category: document.getElementById('category').value,
        };

        const { error: dbError } = await supabase.from('galeria_imagens').insert([imageData]);
        if (dbError) throw dbError;

        alert('Imagem enviada com sucesso!');
        document.getElementById('upload-modal').remove();
        renderGaleriaPage(document.getElementById('page-content')); // Recarrega a galeria

    } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao enviar a imagem: ' + error.message);
        statusDiv.classList.add('hidden');
        submitButton.disabled = false;
    }
}

// Deleta uma imagem
async function deleteImage(id) {
    try {
        // 1. Pega os dados da imagem no banco para saber o nome do arquivo
        const { data: imagem, error: fetchError } = await supabase
            .from('galeria_imagens')
            .select('image_url')
            .eq('id', id)
            .single();
        
        if (fetchError) throw fetchError;

        // Extrai o nome do arquivo da URL
        const fileName = imagem.image_url.split('/').pop();

        // 2. Deleta o arquivo do Storage
        const { error: storageError } = await supabase
            .storage
            .from('galeria')
            .remove([fileName]);
        
        if (storageError) throw storageError;

        // 3. Deleta o registro do banco de dados
        const { error: dbError } = await supabase
            .from('galeria_imagens')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        alert('Imagem excluída com sucesso!');
        renderGaleriaPage(document.getElementById('page-content'));

    } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        alert('Erro ao excluir a imagem: ' + error.message);
    }
}