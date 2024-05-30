const mongoose = require('mongoose')

async function main() {
    try{
        mongoose.set('strictQuery', true);
        
        await mongoose.connect(
            'mongodb+srv://lucasChaves:HY14SZZBXaUlfrsc@godress-api.ezdr7ol.mongodb.net/?retryWrites=true&w=majority&appName=godress-api'
        );

        console.log('conectado com o banco!')
    }
    catch (error){
        console.log(`Erro: ${error}`)
    }
}

module.exports = main

