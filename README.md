# SaborDigital

Sistema fullstack de cardápio, pedidos e cadastro de produtos para um restaurante digital.

## Visão geral

O projeto foi dividido em duas partes:

- `backend/`: API Node.js com Express, MySQL e MVC.
- `frontend/`: interface HTML/CSS/JavaScript que consome a API e gerencia pedidos.

O backend expõe endpoints para produtos, cardápios e pedidos, enquanto o frontend permite visualizar o cardápio, fazer pedidos e salvar dados localmente quando a API está indisponível.

## Estrutura do projeto

- `backend/`
  - `src/app.js`: configura o Express, CORS e as rotas.
  - `src/server.js`: inicia o servidor e testa a conexão com MySQL.
  - `src/config/database.js`: configuração do pool de conexões com MySQL.
  - `src/routes/`: define rotas para produtos, cardápios e pedidos.
  - `src/controllers/`: lógica de controle para cada domínio.
  - `src/repositories/`: acesso ao banco de dados.
  - `src/uploads/`: pasta pública para armazenar imagens de produtos.
  - `database.sql`: script de criação do banco de dados e tabelas.
- `frontend/`
  - `index.html`: página principal do cardápio e pedido.
  - `cadastro.html`: página de cadastro de produtos.
  - `pedidos.html`: painel de pedidos.
  - `src/scripts/`: implementações JavaScript de API e interface.
  - `src/styles/`: estilos visuais.
  - `src/data/produtos.json`: fallback local para produtos.

## Tecnologias usadas

- Backend: Node.js, Express, MySQL, multer, cors, dotenv.
- Frontend: HTML, CSS, JavaScript puro.

## Requisitos

- Node.js
- npm
- MySQL

### Endpoint raiz

- `GET /` mostra informações de status da API.

### Produtos

- `GET /produtos` lista produtos.
- `GET /produtos/:id` busca produto por ID.
- `POST /produtos` cadastra produto (envia `multipart/form-data` com campo `foto`).
- `PUT /produtos/:id` atualiza produto.
- `DELETE /produtos/:id` remove produto.

### Cardápios

- `GET /cardapios` lista cardápios.
- `GET /cardapios/:id` busca cardápio por ID.
- `POST /cardapios` cadastra cardápio.
- `DELETE /cardapios/:id` remove cardápio.

### Pedidos

- `GET /pedidos` lista todos os pedidos.
- `GET /pedidos/:id` busca pedido por ID.
- `POST /pedidos` cria um novo pedido.
- `PATCH /pedidos/:id/status` atualiza o status de um pedido.
- `DELETE /pedidos/:id` exclui um pedido.

## Comportamento do frontend

- `frontend/src/scripts/api.js` implementa a comunicação com a API.
- Se a API não estiver disponível, o frontend pode salvar pedidos em `localStorage` para manter funcionamento offline.
- O frontend usa `fetch` para consumir os endpoints do backend.

## Observações finais

- A pasta `backend/src/uploads/` é servida como recurso estático para imagens de produtos.
- O backend segue arquitetura MVC com separação entre rotas, controladores e repositórios.
- O banco de dados principal recomendado é `sabordigital`.

Este projeto foi desenvolvido como atividade formativa para o curso de Front-End.