const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;


(async () => {

const connectionString = 'mongodb+srv://admin:simplepass@primeiroclusteroceanbac.dhfad.mongodb.net/challenge_loomer_db?retryWrites=true&w=majority';

console.info('Conectando ao banco de dados MongoDB...');

const options = {
    useUnifiedTopology: true
};

const client = await mongodb.MongoClient.connect(connectionString, options);

console.info('MongoDB conectado com sucesso!');

const app = express();

const port = process.env.PORT || 3000;

// Precisamos avisar o Express para utilizar o body-parser
// Assim, ele saberá como transformar as informações no BODY da requisição
// em informação útil para a programação

app.use(bodyParser.json());

/*
-> Create, Read (All/Single), Update & Delete
-> Criar, Ler (Tudo ou Individual), Atualizar e Remover
*/

/*
URL -> http://localhost:3000
Endpoint ou Rota -> [GET] /mensagem
Endpoint ou Rota -> [POST] /mensagem
Endpoint: [GET] /mensagem
Descrição: Ler todas as mensagens
Endpoint: [POST] /mensagem
Descrição: Criar uma mensagem
Endpoint: [GET] /mensagem/{id}
Descrição: Ler mensagem específica pelo ID
Exemplo: [GET] /mensagem/1
Endpoint: [PUT] /mensagem/{id}
Descrição: Edita mensagem específica pelo ID
Endpoint: [DELETE] /mensagem/{id}
Descrição: Remove mensagem específica pelo ID
*/

app.get('/', function (req, res) {
  res.send('Hello World');
});


const db = client.db('challenge_loomer_db');
const users = db.collection('Users');

// Read all

app.get('/users', async function (req, res) {
    const findResult = await users.find().toArray();
    res.send(findResult);
});

// Create
app.post('/create_user', async function (req, res) {
    console.log(req.body)
    const user = {
        'full_name': 'Dayvson silva',
        'email':'userddssilva',
        'pass': '1234'
    };
    const resultado = await users.insertOne(user);
    const objetoInserido = resultado.ops[0];
    res.send(objetoInserido);
});

// Read Single
app.get('/show_user/:id', async function (req, res) {
    const id = req.params.id;
    const user = await users.findOne({ _id: ObjectId(id) });
    res.send(user);
});

// Update
app.put('/update_user/:id', async function (req, res) {
    const id = req.params.id;
    const user = {
        _id: ObjectId(id),
        ...req.body
    };
    await users.updateOne(
        { _id: ObjectId(id) },
        { $set: user }
    );
    res.send(user);
});

// Delete
app.delete('/delete_user/:id', async function (req, res) {
    const id = req.params.id;
    await users.deleteOne({ _id: ObjectId(id) });
    res.send(`O user de ID ${id} foi removido com sucesso.`);
});

app.listen(port, function () {
    console.info('App rodando em http://localhost:' + port);
});

})();