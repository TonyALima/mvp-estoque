const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3001;

app.use(bodyParser.json());

// Carregar dados do estoque
const loadData = () => {
    if (fs.existsSync('data.json')) {
        const data = fs.readFileSync('data.json');
        return JSON.parse(data);
    }
    return [];
};

// Salvar dados do estoque
const saveData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Função para registrar logs
const logOperation = (operation, product) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        operation,
        product
    };
    fs.appendFileSync('operations.log', JSON.stringify(logEntry) + '\n');
};

// Rota para adicionar produtos
app.post('/inventory/api/produtos', (req, res) => {
    const produtos = loadData();
    const novoProduto = req.body;

    // Verificar se o produto já existe no estoque (mesmo nome e preço)
    const produtoExistente = produtos.find(produto => (produto.nome === novoProduto.nome && produto.preco === novoProduto.preco));

    if (produtoExistente) {
        // Se o produto existir, somar a quantidade como número
        produtoExistente.quantidade = Number(produtoExistente.quantidade) + Number(novoProduto.quantidade);
        logOperation('update', produtoExistente);
    } else {
        // Se o produto não existir, adicionar o novo produto com um ID único
        novoProduto.id = uuidv4();
        produtos.push(novoProduto);
        logOperation('add', novoProduto);
    }

    saveData(produtos);
    res.status(201).send(novoProduto);
});

// Rota para consultar produtos
app.get('/inventory/api/produtos', (req, res) => {
    const produtos = loadData();
    res.send(produtos);
});

// Rota para pegar o log das operações
app.get('/inventory/api/logs', (req, res) => {
    if (fs.existsSync('operations.log')) {
        const logs = fs.readFileSync('operations.log', 'utf-8').split('\n').filter(Boolean).map(JSON.parse);
        res.send(logs);
    } else {
        fs.writeFileSync('operations.log', '');
        res.status(200).send([]);
    }
});

// Rota para remover quantidade de produtos
app.delete('/inventory/api/produtos/:id', (req, res) => {
    const produtos = loadData();
    const produtoId = req.params.id;
    const quantidadeRemover = Number(req.body.quantidade);

    const produto = produtos.find(produto => produto.id === produtoId);

    if (produto) {
        if (produto.quantidade >= quantidadeRemover) {
            produto.quantidade -= quantidadeRemover;
            if (produto.quantidade === 0) {
                const index = produtos.indexOf(produto);
                produtos.splice(index, 1);
            }
            saveData(produtos);
            logOperation('remove', { id: produtoId, quantidade: quantidadeRemover });
            res.status(200).send({ message: 'Quantidade removida com sucesso' });
        } else {
            res.status(400).send({ message: 'Quantidade insuficiente em estoque' });
        }
    } else {
        res.status(404).send({ message: 'Produto não encontrado' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Inventory service running on port ${PORT}`);
});