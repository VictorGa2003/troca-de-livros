document.addEventListener('DOMContentLoaded', () => {
    const booksList = document.getElementById('books-list');

    // Carregar livros assim que a página for carregada
    loadBooks();

    function loadBooks() {
        fetch('/get-books')
            .then(response => response.json())
            .then(books => {
                displayBooks(books);
            })
            .catch(error => {
                console.error('Erro ao obter livros:', error);
                booksList.innerHTML = '<li>Erro ao carregar livros. Tente novamente mais tarde.</li>';
            });
    }

    function displayBooks(books) {
        booksList.innerHTML = '';
        if (books.length === 0) {
            booksList.innerHTML = '<li>Nenhum livro anunciado.</li>';
        } else {
            books.forEach(book => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${book.title}</h3>
                    <h4>Autor: ${book.author}</h4>
                    <p>Deseja: ${book.desiredBooks}</p>
                `;
                booksList.appendChild(li);
            });
        }
    }
});
