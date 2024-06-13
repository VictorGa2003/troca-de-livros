document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const usuario = { nome, email, senha };

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('mensagem').textContent = data.message;
    })
    .catch(error => {
        document.getElementById('mensagem').textContent = 'Erro ao cadastrar usuário';
        console.error('Erro:', error);
    });
});
