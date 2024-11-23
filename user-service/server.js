const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();
const PORT = 3002;

app.use(bodyParser.json());

// Carregar usuários do arquivo data.json
const loadUsers = () => {
    if (fs.existsSync('data.json')) {
        const data = fs.readFileSync('data.json');
        return JSON.parse(data);
    }
    return [];
};

// Salvar usuários no arquivo data.json
const saveUsers = () => {
    fs.writeFileSync('data.json', JSON.stringify(users, null, 2));
};

// Defina suas rotas aqui
app.post('/user/login', (req, res) => {
    let users = loadUsers();
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', userId: user.id });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/user/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = { id: uuidv4(), username, password };
    users.push(newUser);
    saveUsers();
    res.status(201).json(newUser);
});

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});