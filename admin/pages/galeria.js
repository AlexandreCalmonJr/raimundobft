// admin/pages/galeria.js
import { db } from '../client.js';
// Importa as funções do Firestore para CRUD
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Função principal que renderiza a página da galeria
export async function renderGaleriaPage(contentContainer) {
    const galeriaRef = collection(db, 'galeria_imagens');
    const q = query(galeriaRef, orderBy('created_at', 'desc'));

    try {
        const querySnapshot = await getDocs(q);
        const imagens = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
                                <i data-lucide="trash-2" class="w-8 h-8 pointer-events-none"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        lucide.createIcons();
        addPageEventListeners();
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        contentContainer.innerHTML = `<p class="text-red-500">Não foi possível carregar as imagens.</p>`;
    }
}

// Adiciona os eventos da página
function addPageEventListeners() {
    document.getElementById('add-image-btn').addEventListener('click', openUploadModal);

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.closest('.group').dataset.id;
            await deleteImage(id);
        });
    });
}

// Abre o modal de upload (Lógica inalterada)
function openUploadModal() {
    const modalHTML = `
        <div id="upload-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

// Lida com o processo de upload para o ImgBB
async function handleUpload(event) {
    event.preventDefault();
    const file = document.getElementById('image-file').files[0];
    if (!file) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
    }

    // --- ATENÇÃO ---
    // Substitua pela sua chave de API do ImgBB
    const apiKey = '0b000b4a3a0aabcdc2aae02ae80ed767';
    const formData = new FormData();
    formData.append('image', file);

    const statusDiv = document.getElementById('upload-status');
    const submitButton = document.getElementById('submit-upload-btn');
    statusDiv.textContent = 'Enviando imagem...';
    statusDiv.classList.remove('hidden');
    submitButton.disabled = true;

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();

        if (!result.success) throw new Error(result.error.message);

        const imageData = {
            image_url: result.data.url,
            alt_text: document.getElementById('alt-text').value,
            category: document.getElementById('category').value,
            created_at: serverTimestamp()
        };
        
        await addDoc(collection(db, 'galeria_imagens'), imageData);

        alert('Imagem enviada com sucesso!');
        document.getElementById('upload-modal').remove();
        renderGaleriaPage(document.getElementById('page-content'));

    } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao enviar a imagem: ' + error.message);
        statusDiv.classList.add('hidden');
        submitButton.disabled = false;
    }
}

// Deleta uma imagem
async function deleteImage(id) {
    if (confirm('Tem certeza que deseja remover esta imagem da galeria?')) {
        try {
            await deleteDoc(doc(db, 'galeria_imagens', id));
            alert('Imagem removida da galeria!');
            renderGaleriaPage(document.getElementById('page-content'));
        } catch (error) {
            console.error('Erro ao remover imagem:', error);
            alert('Erro ao remover a imagem: ' + error.message);
        }
    }
}
