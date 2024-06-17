document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const resultsList = document.getElementById('results-list');
    const chatModal = document.getElementById('chatModal');
    const closeChatBtn = document.querySelector('.close');
    const chatMessages = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const searchTerm = document.getElementById('search-term').value;
        const searchType = document.getElementById('search-type').value;

        searchBooks(searchTerm, searchType);
    });

    function searchBooks(term, type) {
        fetch(`/search?type=${type}&term=${encodeURIComponent(term)}`)
        .then(response => response.json())
        .then(books => {
            displayBooks(books);
        })
        .catch(error => {
            console.error('Erro durante a busca:', error);
            resultsList.innerHTML = '<li>Erro durante a busca. Tente novamente mais tarde.</li>';
        });
    }

    function displayBooks(books) {
        resultsList.innerHTML = '';
        if (books.length === 0) {
            resultsList.innerHTML = '<li>Nenhum livro encontrado.</li>';
        } else {
            books.forEach(book => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${book.title}</h3>
                    <h4>Autor: ${book.author}</h4>
                    <p>Deseja: ${book.desiredBooks}</p>
                    <p>Email: ${book.email || 'Não informado'}</p>
                    <p>Celular: ${book.phone || 'Não informado'}</p>
                    <p>Cidade: ${book.city || 'Não informada'}</p>
                `;

                // Botão "Fechar Negócio"
                const closeButton = document.createElement('button');
                closeButton.textContent = 'Fechar Negócio';
                closeButton.classList.add('close-deal-btn');
                closeButton.addEventListener('click', () => {
                    openChatModal(book.email);
                });

                li.appendChild(closeButton);
                resultsList.appendChild(li);
            });
        }
    }

    function openChatModal(email) {
        chatModal.style.display = 'block';
        chatMessages.innerHTML = ''; // Limpa as mensagens anteriores

        closeChatBtn.onclick = () => {
            chatModal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === chatModal) {
                chatModal.style.display = 'none';
            }
        };

        chatForm.onsubmit = (e) => {
            e.preventDefault();
            const message = messageInput.value.trim();
            if (message) {
                displayMessage('Você', message);
                messageInput.value = '';
            }
        };
    }

    function displayMessage(sender, message) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Rolagem automática para a última mensagem
    }
});
