import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;
const aplicacao = express();

let listaProdutos = [];

aplicacao.use(express.urlencoded({ extended: true }));

aplicacao.use(session({
    secret: 'secretkey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 900000,
    }
}));

aplicacao.use(cookieParser());

function userAutentication(requisicao, resposta, next) {
    if (requisicao.session.usuarioAutenticado) {
        next(); //permitir que a requisição continue a ser processada
    }
    else {
        resposta.redirect('/login.html');
    }
}

function cadastroProduto(requisicao, resposta) {
    const codigo = requisicao.body.codigo;
    const descricao = requisicao.body.descricao;
    const precocusto = requisicao.body.precocusto;
    const precovenda = requisicao.body.precovenda;
    const data = requisicao.body.data;
    const quantidade = requisicao.body.quantidade;
    const nome = requisicao.body.nome;
    if (nome && sobrenome && usuario && cidade && estado && cep) {
        listaUsuarios.push({
            nome: nome,
            sobrenome: sobrenome,
            usuario: usuario,
            cidade: cidade,
            estado: estado,
            cep: cep
        });
        resposta.redirect('/listarProdutos');
    }
}

function userAuthenticate(requisicao, resposta) {
    const usuario = requisicao.body.user;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123') {
        requisicao.session.userAutentication = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else {
        resposta.write('<!DOCTYPE html>');
        resposta.write('<html>');
        resposta.write('<head>');
        resposta.write('<meta charset="UTF-8">');
        resposta.write('<title>Falha na autenticação</title>');
        resposta.write('</head>');
        resposta.write('<body>');
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<a href="/pageLogin.html">Voltar</a>');
        if (requisicao.cookies.dataUltimoAcesso) {
            resposta.write('<p>');
            resposta.write('Seu último acesso foi em ' + requisicao.cookies.dataUltimoAcesso);
            resposta.write('</p>');
        }
        resposta.write('</body>');
        resposta.write('</html>');
        resposta.end();
    }
}

aplicacao.post('/login', userAuthenticate);
aplicacao.use(express.static(path.join(process.cwd(), 'public')));
aplicacao.use(userAutentication, express.static(path.join(process.cwd(), 'protected')));
aplicacao.post('/cadastrarProduto', userAutentication, cadastroProduto);

aplicacao.get('/listarUsuarios', userAutentication, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Relação de produtos</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Produtos Cadastrados</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Fabricante</th>');
    resp.write('<th>Quantidade</th>');
    resp.write('<th>Descricão</th>');
    resp.write('<th>Data de validade</th>');
    resp.write('<th>Código de Barras</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaProdutos.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaProdutos[i].nome}`);
        resp.write(`<td>${listaProdutos[i].quantidade}`);
        resp.write(`<td>${listaProdutos[i].descricao}`);
        resp.write(`<td>${listaProdutos[i].data}`);
        resp.write(`<td>${listaProdutos[i].codigo}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<br/>');

    if (req.cookies.dataUltimoAcesso) {
        resp.write('<p>');
        resp.write('Seu último acesso foi em ' + req.cookies.dataUltimoAcesso);
        resp.write('</p>');
    }

    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

aplicacao.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});

aplicacao.get('/logout', (req, resp) => {
    req.session.destroy();
    //req.session.usuarioLogado = false;
    resp.redirect('/login.html');
});


aplicacao.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})