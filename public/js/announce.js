document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const booksList = document.getElementById('books-list');
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const desiredBooks = document.getElementById('desired-books').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;

    addBook({ title, author, desiredBooks, email, phone, city });
});

function addBook(book) {
    fetch('/add-book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Livro adicionado com sucesso!');
            // Limpar o formulário após o envio
            bookForm.reset();
            // Atualizar a lista de livros
            displayBooks();
        } else {
            alert(data.message); // Mostrar mensagem de erro do servidor, se houver
            bookForm.reset();
        }
    })
    .catch(error => {
        console.error('Erro ao processar requisição:', error);
        alert('Erro ao processar requisição. Verifique o console para mais informações.');
    });
}

function displayBooks() {
    fetch('/get-books')
    .then(response => response.json())
    .then(books => {
        booksList.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.textContent = `${book.title} por ${book.author} - Deseja: ${book.desiredBooks}`;
            booksList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Erro ao obter lista de livros:', error);
        alert('Erro ao obter lista de livros. Verifique o console para mais informações.');
    });
}
});

