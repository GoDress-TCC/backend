const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
    res.send('App rodando!')
})

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})      

    