const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Conexão com o banco de dados
const connection = require('../db/conn')

connection();

const port = 3000

app.get('/', (req, res) => {
    res.send('App rodando!')
})

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})      

