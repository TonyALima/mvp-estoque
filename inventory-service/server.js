const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // Add this line to import uuid
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
//app.use(express.static('../public'));

// Carregar dados do estoque
const loadData = () => {
    if (!fs.existsSync('data.json')) {
        fs.writeFileSync('data.json', JSON.stringify([]));
    }
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
app.post('/inventory/api/produtos', (req, res) => {
    const produtos = loadData();
    const novoProduto = req.body;

    // Verificar se o produto já existe no estoque (mesmo nome e preço)
    const produtoExistente = produtos.find(produto => (produto.nome === novoProduto.nome && produto.preco === novoProduto.preco));

    if (produtoExistente) {
        // Se o produto existir, somar a quantidade como número
        produtoExistente.quantidade = Number(produtoExistente.quantidade) + Number(novoProduto.quantidade);
    } else {
        // Se o produto não existir, adicionar o novo produto com um ID único
        novoProduto.id = uuidv4();
        produtos.push(novoProduto);
    }

    saveData(produtos);
    res.status(201).send(novoProduto);
});

// Rota para consultar produtos
app.get('/inventory/api/produtos', (req, res) => {
    const produtos = loadData();
    res.send(produtos);
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
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});