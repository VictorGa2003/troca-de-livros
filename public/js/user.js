document.addEventListener('DOMContentLoaded', function() {
    // Verifique se o usuário está autenticado
    fetch('/user-info')
        .then(response => {
            if (!response.ok) {
                throw new Error('Usuário não autenticado');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('userName').textContent = data.nome;
            document.getElementById('userEmail').textContent = data.email;
            document.getElementById('userNome').textContent = data.nome;
            loadUserBooks(data.email); // Passa o email do usuário para carregar apenas seus livros
        })
        .catch(error => {
            console.error('Erro ao carregar informações do usuário:', error);
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = '/login.html'; // Redireciona para a página de login se não estiver autenticado
        });

    // Carrega os livros do usuário
    function loadUserBooks(email) {
        fetch(`/get-books`)
            .then(response => response.json())
            .then(books => {
                const userBooks = document.getElementById('userBooks');
                userBooks.innerHTML = '';
                books.forEach(book => {
                    if (book.email === email) {
                        const li = document.createElement('li');
                        li.textContent = `${book.title} por ${book.author}`;
                        userBooks.appendChild(li);
                    }
                });
            })
            .catch(error => console.error('Erro ao carregar livros do usuário:', error));
    }

    // Logout do usuário
    document.getElementById('logoutButton').addEventListener('click', function() {
        fetch('/logout', {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer logout');
            }
            return response.json();
        })
        .then(data => {
            alert('Logout realizado com sucesso!');
            window.location.href = '/login.html'; // Redireciona para a página de login após logout
        })
        .catch(error => {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Verifique o console para mais detalhes.');
        });
    });
});
