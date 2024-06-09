const { response } = require('express');
const { User: userModel } = require('../models/User')

const userController = {
    create: async(req, res) => {
        try{
            const user = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                age: req.body.age,
            }
            
            const userExists = await userModel.findOne({ email: email })

            if(userExists) {
                res.status(422).json({ msg: "Este email já está cadastrado" })
            }

            

            // const response = await userModel.create(user);
            // res.status(201).json({ response, msg: "Usuário criado com sucesso!" });
        }
        catch(error){
            res.status(400).json({ msg: error.message })
        }
    }
};

module.exports = userController;