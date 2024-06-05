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

            const response = await userModel.create(user);

            res.status(201).json({ response, msg: "Usuário criado com sucesso!" });
        }
        catch(error){
            console.log(error)
        }
    }
};

module.exports = userController;