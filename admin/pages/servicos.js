// admin/pages/servicos.js
import { db } from '../client.js';
// Importa as funções do Firestore para CRUD
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Função principal que renderiza a página de serviços
export async function renderServicosPage(contentContainer) {
    // Cria uma consulta para buscar os serviços ordenados pela data de criação
    const servicosRef = collection(db, 'servicos');
    const q = query(servicosRef, orderBy('created_at', 'desc'));
    
    try {
        const querySnapshot = await getDocs(q);
        const servicos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Monta o HTML da página com os dados do Firestore
        contentContainer.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold">Serviços Cadastrados</h2>
                <button id="add-service-btn" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Adicionar Serviço
                </button>
            </div>
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <table class="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Título</th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Descrição</th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ícone</th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody id="services-table-body">
                        ${servicos.map(servico => `
                            <tr data-id="${servico.id}">
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${servico.title}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${servico.description}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${servico.icon}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                    <button class="edit-btn bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs">Editar</button>
                                    <button class="delete-btn bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Excluir</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Adiciona os eventos aos botões da página
        addPageEventListeners(servicos);

    } catch (error) {
        console.error('Erro ao buscar serviços:', error);
        contentContainer.innerHTML = `<p class="text-red-500">Não foi possível carregar os serviços.</p>`;
    }
}

// Função para adicionar os eventos da página
function addPageEventListeners(servicos) {
    document.getElementById('add-service-btn').addEventListener('click', () => {
        openServiceModal();
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.closest('tr').dataset.id;
            const servico = servicos.find(s => s.id === id);
            openServiceModal(servico);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.closest('tr').dataset.id;
            if (confirm('Tem certeza que deseja excluir este serviço?')) {
                await deleteService(id);
            }
        });
    });
}

// Função para abrir o modal de adicionar/editar (Lógica inalterada)
function openServiceModal(servico = null) {
    const modalHTML = `
        <div id="service-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 class="text-2xl font-bold mb-4">${servico ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h2>
                <form id="service-form">
                    <input type="hidden" id="service-id" value="${servico ? servico.id : ''}">
                    <div class="mb-4">
                        <label for="title" class="block text-gray-700">Título</label>
                        <input type="text" id="title" class="w-full p-2 border rounded" value="${servico ? servico.title : ''}" required>
                    </div>
                    <div class="mb-4">
                        <label for="description" class="block text-gray-700">Descrição</label>
                        <textarea id="description" class="w-full p-2 border rounded">${servico ? servico.description : ''}</textarea>
                    </div>
                    <div class="mb-4">
                        <label for="icon" class="block text-gray-700">Ícone (Nome do Lucide Icon)</label>
                        <input type="text" id="icon" class="w-full p-2 border rounded" value="${servico ? servico.icon : ''}">
                    </div>
                    <div class="flex justify-end gap-4">
                        <button type="button" id="cancel-btn" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('service-form').addEventListener('submit', saveService);
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('service-modal').remove();
    });
}

// Função para salvar (criar ou atualizar) um serviço
async function saveService(event) {
    event.preventDefault();
    const id = document.getElementById('service-id').value;
    const serviceData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        icon: document.getElementById('icon').value,
    };

    try {
        if (id) {
            // Atualiza um serviço existente
            const docRef = doc(db, 'servicos', id);
            await updateDoc(docRef, serviceData);
        } else {
            // Cria um novo serviço, adicionando um timestamp
            serviceData.created_at = serverTimestamp();
            await addDoc(collection(db, 'servicos'), serviceData);
        }
        document.getElementById('service-modal').remove();
        renderServicosPage(document.getElementById('page-content')); // Recarrega a lista
    } catch (error) {
        alert('Erro ao salvar o serviço: ' + error.message);
    }
}

// Função para deletar um serviço
async function deleteService(id) {
    try {
        await deleteDoc(doc(db, 'servicos', id));
        renderServicosPage(document.getElementById('page-content')); // Recarrega a lista
    } catch (error) {
        alert('Erro ao excluir o serviço: ' + error.message);
    }
}
