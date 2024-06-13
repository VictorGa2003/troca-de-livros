const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Criação das tabelas
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, senha TEXT, reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", (err) => {
        if (err) {
            console.error('Erro ao criar tabela usuarios:', err.message);
        } else {
            console.log('Tabela usuarios criada com sucesso.');
        }
    });

    db.run("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, desiredBooks TEXT, email TEXT, phone TEXT, city TEXT)", (err) => {
        if (err) {
            console.error('Erro ao criar tabela books:', err.message);
        } else {
            console.log('Tabela books criada com sucesso.');
        }
    });
});

// Rota para cadastro de usuários
app.post('/cadastro', (req, res) => {
    const { nome, email, senha } = req.body;

    // Verifique se os dados estão chegando corretamente
    console.log('Dados recebidos para cadastro:', req.body);

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nome || !email || !senha) {
        console.error('Erro: Campos obrigatórios faltando');
        return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
    }

    // Insere o novo usuário no banco de dados
    const query = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
    db.run(query, [nome, email, senha], function(err) {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err.message);
            return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
        }
        console.log('Usuário cadastrado com sucesso!', { id: this.lastID });
        res.json({ message: 'Usuário cadastrado com sucesso!', userID: this.lastID });
    });
});

// Rota para adicionar um livro
app.post('/add-book', (req, res) => {
    const { title, author, desiredBooks, email, phone, city } = req.body;

    console.log('Dados recebidos para adicionar livro:', req.body);

    if (!title || !author || !desiredBooks || !email || !phone || !city) {
        return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
    }

    const stmt = db.prepare("INSERT INTO books (title, author, desiredBooks, email, phone, city) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(title, author, desiredBooks, email, phone, city, function(err) {
        if (err) {
            console.error('Erro ao adicionar livro:', err.message);
            return res.status(500).json({ message: 'Erro ao adicionar livro' });
        }
        console.log('Livro adicionado com sucesso!', { id: this.lastID });
        res.json({ message: 'Livro adicionado com sucesso!', bookID: this.lastID });
    });
    stmt.finalize();
});

// Rota para obter todos os livros
app.get('/get-books', (req, res) => {
    db.all("SELECT * FROM books", (err, rows) => {
        if (err) {
            console.error('Erro ao obter livros:', err.message);
            res.json([]);
        } else {
            res.json(rows);
        }
    });
});

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para busca de livros
app.get('/search', (req, res) => {
    const type = req.query.type;
    const term = req.query.term;
    let sql = "";
    let params = [];

    if (type === "title") {
        sql = "SELECT * FROM books WHERE title LIKE ?";
        params = [`%${term}%`];
    } else if (type === "author") {
        sql = "SELECT * FROM books WHERE author LIKE ?";
        params = [`%${term}%`];
    } else {
        res.json([]);
        return;
    }

    console.log("SQL Query:", sql, params);

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("Erro durante a busca no banco de dados:", err.message);
            res.json([]);
        } else {
            console.log("Resultados da busca:", rows);
            res.json(rows);
        }
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    console.log('Tentativa de login:', req.body);

    // Verifique as credenciais do usuário no banco de dados
    const query = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;
    db.get(query, [email, senha], (err, row) => {
        if (err) {
            console.error('Erro ao fazer login:', err.message);
            return res.status(500).json({ message: 'Erro ao fazer login' });
        }
        if (!row) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }
        res.json({ message: 'Login realizado com sucesso!' });
    });
});


// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


