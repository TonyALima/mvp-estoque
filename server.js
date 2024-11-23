const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Carregar dados do estoque
const loadData = () => {
    try {
        const data = fs.readFileSync('data.json', 'utf8');
        return data ? JSON.parse(data) : []; // Retorna um array vazio se o arquivo estiver vazio
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        return []; // Retorna um array vazio em caso de erro
    }
};

// Salvar dados do estoque
const saveData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Rota para cadastrar produtos
app.post('/api/produtos', (req, res) => {
    const produtos = loadData();
    const novoProduto = req.body;

    // Verificar se o produto já existe no estoque
    const produtoExistente = produtos.find(produto => produto.id === novoProduto.id);

    if (produtoExistente) {
        // Se o produto existir, somar a quantidade como número
        produtoExistente.quantidade = Number(produtoExistente.quantidade) + Number(novoProduto.quantidade);
    } else {
        // Se o produto não existir, adicionar o novo produto
        produtos.push(novoProduto);
    }

    saveData(produtos);
    res.status(201).send(novoProduto);
});

// Rota para consultar produtos
app.get('/api/produtos', (req, res) => {
    const produtos = loadData();
    res.send(produtos);
});

// Rota para remover produtos
app.delete('/api/produtos/:id', (req, res) => {
    const produtos = loadData();
    const produtoId = req.params.id;

    const index = produtos.findIndex(produto => produto.id === produtoId);

    if (index !== -1) {
        produtos.splice(index, 1);
        saveData(produtos);
        res.status(200).send({ message: 'Produto removido com sucesso' });
    } else {
        res.status(404).send({ message: 'Produto não encontrado' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});