document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const resultsList = document.getElementById('results-list');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Clicou em pesquisar'); // Adicionando um console.log para verificar se o evento está sendo acionado

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
                    <h4> Autor: ${book.author}</h4>
                    <p>Deseja: ${book.desiredBooks}</p>
                    <p>Email: ${book.email || 'Não informado'} 
                    <p>Celular: ${book.phone || 'Não informado'}</p>
                    <p>Cidade: ${book.city || 'Não informada'}</p>
                `;
                resultsList.appendChild(li);
            });
        }
    }    
    
});
