document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        // Envia os dados para o servidor via fetch
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer login: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert(data.message); // Exibe uma mensagem para o usuário
            // Redireciona ou faz outra ação conforme necessário
            if (data.message === 'Login realizado com sucesso!') {
                window.location.href = '/'; // Redireciona para a página inicial, por exemplo
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Verifique o email e senha.');
        });
    });
});
