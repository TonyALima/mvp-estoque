document.getElementById('produtoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const preco = document.getElementById('preco').value;

    const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, quantidade, preco })
    });

    if (response.ok) {
        loadProdutos();
        document.getElementById('produtoForm').reset();
    }
});

const loadProdutos = async () => {
    const response = await fetch('/api/produtos');
    const produtos = await response.json();
    const produtosList = document.getElementById('produtosList');
    produtosList.innerHTML = '';
    produtos.forEach(produto => {
        const li = document.createElement('li');
        li.textContent = `${produto.nome} - Quantidade: ${produto.quantidade} - Preço: R$${produto.preco}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.classList.add('remove');
        removeButton.addEventListener('click', async () => {
            await fetch(`/api/produtos/${produto.id}`, {
                method: 'DELETE'
            });
            loadProdutos();
        });

        li.appendChild(removeButton);
        produtosList.appendChild(li);
    });
};

// Carregar produtos ao iniciar
loadProdutos();