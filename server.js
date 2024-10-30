import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express();
app.use(express.json());

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
            DataEmissao: req.body.DataEmissao
        }
    })

    res.status(201).json(req.body)
})


app.get('/solicitacao', async (req, res) => {
    
    const lista = await prisma.solicitacao.findMany()
    
    res.status(200).json(lista)
})

app.listen(3000);