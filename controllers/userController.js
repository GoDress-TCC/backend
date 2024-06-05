const {User: userModel} = require('../models/User')

const userController = {
    create: async(req, res) => {
        try{
            const user = {
                name: req.body.name,
                surname: req.body.name,
                email: req.body.email,
                password: req.body.password,
                age: req.body.password,
            }

            const response = await UserModel.create(userser);

            res.status(201).json({response, msg: 'Usuário criado com sucesso!'});
        }
        catch(error){
            console.log(error)
        }
    }
};

module.exports = userController;