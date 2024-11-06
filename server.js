import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

// Configuração do middleware JSON e CORS
app.use(express.json());

// Configurações de CORS
const allowedOrigins = ['https://frotasqually.vercel.app', 'https://frotasqually.vercel.app/solicitacao'];
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

// Rota para criação de uma solicitação
app.post('/solicitacao', async (req, res) => {
    try {
        console.log('Criando uma nova solicitação...');
        const novaSolicitacao = await prisma.solicitacao.create({
            data: {
                Solicitante: req.body.Solicitante,
                Filial: req.body.Filial,
                TipoServ: req.body.TipoServ,
                Servico: req.body.Servico,
                Equipamento: req.body.Equipamento,
                Urgencia: req.body.Urgencia,
                Descricao: req.body.Descricao,
                DataSolicitacao: req.body.DataSolicitacao,
                DataEmissao: req.body.DataEmissao,
                Estado: req.body.Estado,
                DataEncerrado: req.body.DataEncerrado
            }
        });
        console.log('Solicitação criada:', novaSolicitacao);
        res.status(201).json(novaSolicitacao);
    } catch (error) {
        console.error("Erro ao criar solicitação:", error);
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message, stack: error.stack });
    }
});

// Rota para atualização de uma solicitação existente
app.put('/solicitacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Atualizando solicitação com ID: ${id}`);
        const solicitacaoAtualizada = await prisma.solicitacao.update({
            where: { id },
            data: {
                Solicitante: req.body.Solicitante,
                Filial: req.body.Filial,
                TipoServ: req.body.TipoServ,
                Servico: req.body.Servico,
                Equipamento: req.body.Equipamento,
                Urgencia: req.body.Urgencia,
                Descricao: req.body.Descricao,
                DataSolicitacao: req.body.DataSolicitacao,
                DataEmissao: req.body.DataEmissao,
                Estado: req.body.Estado,
                DataEncerrado: req.body.DataEncerrado
            }
        });
        console.log('Solicitação atualizada:', solicitacaoAtualizada);
        res.status(200).json(solicitacaoAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar a solicitação:", error);
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message, stack: error.stack });
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
        console.error("Erro ao obter solicitações:", error);
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message, stack: error.stack });
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
        console.error("Erro ao deletar a solicitação:", error);
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message, stack: error.stack });
    }
});

// Inicializa o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
