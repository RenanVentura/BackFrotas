import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Inicializando Prisma
const prisma = new PrismaClient();

// Criando o app Express
const app = express();

// Configurações de CORS
const allowedOrigins = ['https://frotasqually.vercel.app', 'https://frotasqually.vercel.app/solicitacao'];
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.error(`CORS não permitido para o domínio: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Usando JSON no corpo das requisições
app.use(express.json());

// Rota para criação de uma solicitação
app.post('/solicitacao', async (req, res) => {
    console.log('Recebendo dados para criar uma solicitação:', req.body);
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
        console.log('Solicitação criada com sucesso:', novaSolicitacao);
        res.status(201).json(novaSolicitacao);
    } catch (error) {
        console.error("Erro ao criar solicitação:", error);
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
    }
});

// Rota para atualização de uma solicitação existente
app.put('/solicitacao/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Atualizando solicitação com ID: ${id}`, req.body);
    try {
        const solicitacaoAtualizada = await prisma.solicitacao.update({
            where: { id: Number(id) },
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
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
    }
});

// Rota para obter todas as solicitações
app.get('/solicitacao', async (req, res) => {
    console.log('Buscando todas as solicitações...');
    try {
        const listaSolicitacoes = await prisma.solicitacao.findMany();
        console.log('Solicitações encontradas:', listaSolicitacoes);
        res.status(200).json(listaSolicitacoes);
    } catch (error) {
        console.error("Erro ao obter solicitações:", error);
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
    }
});

// Rota para deletar uma solicitação
app.delete('/solicitacao/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Deletando solicitação com ID: ${id}`);
    try {
        const solicitacao = await prisma.solicitacao.findUnique({
            where: { id: Number(id) }
        });

        if (!solicitacao) {
            console.error(`Solicitação com ID ${id} não encontrada.`);
            return res.status(404).json({ message: "Solicitação não encontrada." });
        }

        await prisma.solicitacao.delete({
            where: { id: Number(id) }
        });

        console.log(`Solicitação com ID ${id} deletada com sucesso.`);
        res.status(200).json({ message: "Solicitação deletada com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar a solicitação:", error);
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
    }
});

// Inicializando o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
