const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(bodyParser.json());

let produtos = [];

// Load inventory data
const loadData = () => {
    if (fs.existsSync('data.json')) {
        const data = fs.readFileSync('data.json');
        return JSON.parse(data);
    }
    return [];
};

// Save inventory data
const saveData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Define routes
app.post('/inventory/api/produtos', (req, res) => {
    produtos = loadData();
    const novoProduto = req.body;
    const produtoExistente = produtos.find(produto => (produto.nome === novoProduto.nome && produto.preco === novoProduto.preco));

    if (produtoExistente) {
        produtoExistente.quantidade = Number(produtoExistente.quantidade) + Number(novoProduto.quantidade);
    } else {
        novoProduto.id = uuidv4();
        produtos.push(novoProduto);
    }

    saveData(produtos);
    res.status(201).send(novoProduto);
});

app.get('/inventory/api/produtos', (req, res) => {
    produtos = loadData();
    res.send(produtos);
});

test('POST /inventory/api/produtos adds a new product', async () => {
    const newProduct = { nome: 'Produto Teste', quantidade: 10, preco: 100 };
    const response = await request(app).post('/inventory/api/produtos').send(newProduct);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe(newProduct.nome);
});

test('GET /inventory/api/produtos returns a list of products', async () => {
    const response = await request(app).get('/inventory/api/produtos');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});