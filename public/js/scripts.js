document.addEventListener('DOMContentLoaded', () => {
    const booksList = document.getElementById('books-list');

    function displayBooks() {
        fetch('/get-books')
        .then(response => response.json())
        .then(books => {
            booksList.innerHTML = '';
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `LIVRO: ${book.title}, AUTOR: ${book.author} - Deseja: ${book.desiredBooks}`;
                booksList.appendChild(li);
            });
        });
    }

    displayBooks();
});
