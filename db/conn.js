const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

async function main() {
    try{
        mongoose.set('strictQuery', true);
        
        await mongoose.connect(
            process.env.URI
        );

        console.log('conectado com o banco!')
    }
    catch (error){
        console.log(`Erro: ${error}`)
    }
}

module.exports = main

