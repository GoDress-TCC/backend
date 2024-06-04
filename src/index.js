const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

// Conexão com o banco de dados
const connection = require('../db/conn')

connection();

// Models
const User = require('../models/User')

const port = 3000

app.get('/', (req, res) => {
    res.send('App rodando!')
})

app.post('/auth/register', async(req, res) => {
    const{ name, email, password, confirmpassword } = req.body

    if(!name){
        return res.status(422).json({ msg: 'O nome é obrigatório!' })
    }
    if(!email){
        return res.status(422).json({ msg: 'O email é obrigatório!' })
    }
    if(!password){
        return res.status(422).json({ msg: 'A senha é obrigatória!' })
    }
    if(password !== confirmpassword){
        return res.status(422).json({ msg: 'As senhas não conferem!' })
    }
})

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})      

