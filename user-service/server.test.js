const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());

let users = [];

// Load users from data.json
const loadUsers = () => {
    if (fs.existsSync('data.json')) {
        const data = fs.readFileSync('data.json');
        return JSON.parse(data);
    }
    return [];
};

// Save users to data.json
const saveUsers = () => {
    fs.writeFileSync('data.json', JSON.stringify(users, null, 2));
};

// Define routes
app.post('/user/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = { id: uuidv4(), username, password };
    users.push(newUser);
    saveUsers();
    res.status(201).json(newUser);
});

app.post('/user/login', (req, res) => {
    users = loadUsers();
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', userId: user.id });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

test('POST /user/register creates a new user', async () => {
    const newUser = { username: 'testuser', password: 'testpass' };
    const response = await request(app).post('/user/register').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(newUser.username);
});

test('POST /user/login logs in a user', async () => {
    const newUser = { username: 'testuser', password: 'testpass' };
    await request(app).post('/user/register').send(newUser);
    const response = await request(app).post('/user/login').send(newUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
});