document.addEventListener('DOMContentLoaded', () => {
    const booksList = document.getElementById('books-list');
    const registerButton = document.querySelector('nav a[href="register.html"]');
    const loginButton = document.querySelector('nav a[href="login.html"]');
    const userButton = document.querySelector('nav a[href="user.html"]');

    // Verificar se o usuário está autenticado
    fetch('/user-info')
        .then(response => {
            if (!response.ok) {
                // Usuário não está autenticado, mostrar botões de cadastro e login
                registerButton.style.display = 'inline-block';
                loginButton.style.display = 'inline-block';
                userButton.style.display = 'none'; // Esconder link da área do usuário
                loadBooks(); // Carregar livros públicos
            } else {
                // Usuário está autenticado, esconder botões de cadastro e login
                registerButton.style.display = 'none';
                loginButton.style.display = 'none';
                userButton.style.display = 'inline-block'; // Mostrar link da área do usuário
                loadUserBooks(); // Carregar apenas os livros do usuário logado
            }
        })
        .catch(error => {
            console.error('Erro ao verificar autenticação:', error);
            // Em caso de erro, tratar como usuário não autenticado
            registerButton.style.display = 'inline-block';
            loginButton.style.display = 'inline-block';
            userButton.style.display = 'none'; // Esconder link da área do usuário
            loadBooks(); // Carregar livros públicos
        });

    function loadBooks() {
        fetch('/get-books')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter livros');
                }
                return response.json();
            })
            .then(books => {
                displayBooks(books);
            })
            .catch(error => {
                console.error('Erro ao obter livros:', error);
                booksList.innerHTML = '<li>Erro ao carregar livros. Tente novamente mais tarde.</li>';
            });
    }

    function loadUserBooks() {
        fetch('/get-books')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter livros do usuário');
                }
                return response.json();
            })
            .then(books => {
                displayBooks(books);
            })
            .catch(error => {
                console.error('Erro ao obter livros do usuário:', error);
                booksList.innerHTML = '<li>Erro ao carregar seus livros. Tente novamente mais tarde.</li>';
            });
    }

    function displayBooks(books) {
        booksList.innerHTML = '';
        if (books.length === 0) {
            booksList.innerHTML = '<li>Nenhum livro encontrado.</li>';
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
