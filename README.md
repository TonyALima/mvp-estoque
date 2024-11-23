# mvp-estoque

Trabalho para disciplina de Engenharia de Software

## Descrição

Este projeto é uma aplicação dividida em microserviços para gerenciar estoque e usuários. Ele consiste em três serviços principais:

- `inventory-service`: Serviço para gerenciar o estoque.
- `user-service`: Serviço para gerenciar login e usuários.
- `proxy-server`: Servidor proxy para rotear as requisições para os serviços apropriados.

## Pré-requisitos

- Node.js
- npm

## Instalação

1. Clone o repositório:

    ``` bash
    git clone https://github.com/seu-usuario/mvp-estoque.git
    cd mvp-estoque
    ```

2. Instale as dependências:

    ```sh
    npm install
    ```

## Iniciar o Projeto

Para iniciar todos os serviços simultaneamente, execute o comando:

```sh
npm start
```
