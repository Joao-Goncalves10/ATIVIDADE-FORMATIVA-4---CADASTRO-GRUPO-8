const path = require('path');
// Carrega variáveis de ambiente antes de requerer app/rotas
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

// Se estiver no modo de desenvolvimento sem banco (DEV_MOCK=true),
// não tenta conectar ao MySQL — inicia o servidor imediatamente.
async function startServer() {
    if (process.env.DEV_MOCK === 'true') {
        app.listen(PORT, () => {
            console.log(`Servidor rodando em modo MOCK na porta ${PORT} 🚀`);
            console.log(`Rotas MVC ativas (mock) e escutando!`);
        });
        return;
    }

    // Testando conexão de forma assíncrona com Promises e iniciando o servidor
    try {
        const connection = await pool.getConnection();
        console.log("Conexão com MySQL estabelecida! ✔️");
        connection.release();

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT} 🚀`);
            console.log(`Rotas MVC ativas e escutando!`);
        });
    } catch (err) {
        console.error("Erro fatal ao conectar ao banco de dados:", err);
        process.exit(1);
    }
}

startServer();