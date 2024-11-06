import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Configurações de CORS
const allowedOrigins = ['https://frotasqually.vercel.app/', 'https://frotasqually.vercel.app/solicitacao'];
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

        res.status(201).json(novaSolicitacao);
    } catch (error) {
        console.error("Erro ao criar solicitação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

// Rota para atualização de uma solicitação existente
app.put('/solicitacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
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

        res.status(200).json(solicitacaoAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar a solicitação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

// Rota para obter todas as solicitações
app.get('/solicitacao', async (req, res) => {
    try {
        const listaSolicitacoes = await prisma.solicitacao.findMany();
        res.status(200).json(listaSolicitacoes);
    } catch (error) {
        console.error("Erro ao obter solicitações:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

// Rota para deletar uma solicitação
app.delete('/solicitacao/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Verifica se o registro existe
        const solicitacao = await prisma.solicitacao.findUnique({
            where: { id }
        });

        if (!solicitacao) {
            return res.status(404).json({ message: "Registro não encontrado." });
        }

        // Deleta o registro existente
        await prisma.solicitacao.delete({
            where: { id }
        });

        res.status(200).json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar a solicitação:", error);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

// Inicializa o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
