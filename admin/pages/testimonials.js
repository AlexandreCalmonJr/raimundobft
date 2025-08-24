// admin/pages/testimonials.js
import { db } from '../client.js';
// Importa as funções do Firestore para CRUD
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Função principal que renderiza a página de depoimentos
export async function renderTestimonialsPage(contentContainer) {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, orderBy('created_at', 'desc'));
    
    try {
        const querySnapshot = await getDocs(q);
        const testimonials = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        contentContainer.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold">Depoimentos de Clientes</h2>
                <button id="add-testimonial-btn" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Adicionar Depoimento
                </button>
            </div>
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <table class="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Autor</th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Depoimento</th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fonte</th>
                            <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${testimonials.map(item => `
                            <tr data-id="${item.id}">
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${item.author_name}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm w-1/2">${item.testimonial_text}</td>
                                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">${item.source}</td>
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

        addPageEventListeners(testimonials);
    } catch (error) {
        console.error('Erro ao buscar depoimentos:', error);
        contentContainer.innerHTML = `<p class="text-red-500">Não foi possível carregar os depoimentos.</p>`;
    }
}

function addPageEventListeners(testimonials) {
    document.getElementById('add-testimonial-btn').addEventListener('click', () => openModal());

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.closest('tr').dataset.id;
            const item = testimonials.find(t => t.id === id);
            openModal(item);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.closest('tr').dataset.id;
            if (confirm('Tem certeza que deseja excluir este depoimento?')) {
                try {
                    await deleteDoc(doc(db, 'testimonials', id));
                    renderTestimonialsPage(document.getElementById('page-content'));
                } catch (error) {
                    alert('Erro ao excluir: ' + error.message);
                }
            }
        });
    });
}

function openModal(item = null) {
    const modalHTML = `
        <div id="testimonial-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 class="text-2xl font-bold mb-4">${item ? 'Editar' : 'Adicionar'} Depoimento</h2>
                <form id="testimonial-form">
                    <input type="hidden" id="testimonial-id" value="${item ? item.id : ''}">
                    <div class="mb-4">
                        <label for="author_name" class="block text-gray-700">Nome do Autor</label>
                        <input type="text" id="author_name" class="w-full p-2 border rounded" value="${item ? item.author_name : ''}" required>
                    </div>
                    <div class="mb-4">
                        <label for="testimonial_text" class="block text-gray-700">Texto do Depoimento</label>
                        <textarea id="testimonial_text" rows="4" class="w-full p-2 border rounded" required>${item ? item.testimonial_text : ''}</textarea>
                    </div>
                    <div class="mb-4">
                        <label for="source" class="block text-gray-700">Fonte (Ex: Instagram)</label>
                        <input type="text" id="source" class="w-full p-2 border rounded" value="${item ? item.source : ''}">
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

    document.getElementById('testimonial-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('testimonial-id').value;
        const data = {
            author_name: document.getElementById('author_name').value,
            testimonial_text: document.getElementById('testimonial_text').value,
            source: document.getElementById('source').value,
        };
        
        try {
            if (id) {
                await updateDoc(doc(db, 'testimonials', id), data);
            } else {
                data.created_at = serverTimestamp();
                await addDoc(collection(db, 'testimonials'), data);
            }
            document.getElementById('testimonial-modal').remove();
            renderTestimonialsPage(document.getElementById('page-content'));
        } catch (error) {
             alert('Erro ao salvar: ' + error.message);
        }
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('testimonial-modal').remove();
    });
}
