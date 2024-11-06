import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

// Configuração do middleware JSON e CORS
app.use(express.json());

// Configurações de CORS
const allowedOrigins = ['https://frotasqually.vercel.app'];
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Função para tratar erros
function handleError(error, res) {
    console.error("Erro:", error);
    res.status(500).json({ message: "Erro interno no servidor.", error: error.message, stack: error.stack });
}

// Rota para criação de uma solicitação
app.post('/solicitacao', async (req, res) => {
    try {
        console.log('Criando uma nova solicitação...');
        const { Solicitante, Filial, TipoServ, Servico, Equipamento, Urgencia, Descricao, DataSolicitacao, DataEmissao, Estado, DataEncerrado } = req.body;

        // Validação básica dos dados
        if (!Solicitante || !Filial || !TipoServ || !Servico) {
            return res.status(400).json({ message: "Dados faltando na solicitação." });
        }

        const novaSolicitacao = await prisma.solicitacao.create({
            data: {
                Solicitante,
                Filial,
                TipoServ,
                Servico,
                Equipamento,
                Urgencia,
                Descricao,
                DataSolicitacao,
                DataEmissao,
                Estado,
                DataEncerrado
            }
        });
        console.log('Solicitação criada:', novaSolicitacao);
        res.status(201).json(novaSolicitacao);
    } catch (error) {
        handleError(error, res);
    }
});

// Rota para atualização de uma solicitação existente
app.put('/solicitacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Atualizando solicitação com ID: ${id}`);
        const solicitacaoAtualizada = await prisma.solicitacao.update({
            where: { id },
            data: req.body
        });
        console.log('Solicitação atualizada:', solicitacaoAtualizada);
        res.status(200).json(solicitacaoAtualizada);
    } catch (error) {
        handleError(error, res);
    }
});

// Rota para obter todas as solicitações
app.get('/solicitacao', async (req, res) => {
    try {
        console.log('Buscando todas as solicitações...');
        const listaSolicitacoes = await prisma.solicitacao.findMany();
        console.log('Solicitações encontradas:', listaSolicitacoes);
        res.status(200).json(listaSolicitacoes);
    } catch (error) {
        handleError(error, res);
    }
});

// Rota para deletar uma solicitação
app.delete('/solicitacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Deletando solicitação com ID: ${id}`);
        const solicitacao = await prisma.solicitacao.findUnique({
            where: { id }
        });

        if (!solicitacao) {
            return res.status(404).json({ message: "Solicitação não encontrada." });
        }

        await prisma.solicitacao.delete({
            where: { id }
        });

        console.log(`Solicitação com ID: ${id} deletada.`);
        res.status(200).json({ message: "Solicitação deletada com sucesso!" });
    } catch (error) {
        handleError(error, res);
    }
});

// Inicializa o servidor na porta 3000
app.listen(3000, async () => {
    try {
        // Verificando se o Prisma está conectado
        await prisma.$connect();
        console.log('Servidor rodando na porta 3000');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1); // Encerra o servidor se a conexão com o banco falhar
    }
});
