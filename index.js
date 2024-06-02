import express from 'express';

const host = '0.0.0.0';
const porta = 3000;
const app = express();

app.listen(porta, host, ()=>{
    console.log(`Servidor rodando em http://${host}:${porta}`);
})