document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const resultsList = document.getElementById('results-list');

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
                closeButton.classList.add('close-deal-btn'); // Adiciona classe para estilização
                closeButton.addEventListener('click', () => {
                    closeDeal(book.id); // Chama a função para fechar o negócio com o livro específico
                });

                li.appendChild(closeButton);
                resultsList.appendChild(li);
            });
        }
    }

    // Função para fechar o negócio com um livro específico
    function closeDeal(bookId) {
        fetch(`/close-deal/${bookId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Exibe uma mensagem com o resultado da ação
            // Aqui você pode adicionar mais ações conforme necessário, como atualizar a lista de livros, etc.
        })
        .catch(error => {
            console.error('Erro ao fechar o negócio:', error);
            alert('Erro ao fechar o negócio. Verifique o console para mais detalhes.');
        });
    }
});
