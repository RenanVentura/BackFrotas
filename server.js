import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Configuração de CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.post('/solicitacao', async (req, res) => {
    await prisma.solicitacao.create({
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

    res.status(201).json(req.body);
});

app.put('/solicitacao/:id', async (req, res) => {
    await prisma.solicitacao.update({
        where: {
            id: req.params.id
        },
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

    res.status(201).json(req.body);
});

app.get('/solicitacao', async (req, res) => {
    const lista = await prisma.solicitacao.findMany();
    res.status(200).json(lista);
});

app.delete('/solicitacao/:id', async (req, res) => {
    await prisma.solicitacao.delete({
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
