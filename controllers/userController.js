const { response } = require('express');
const { User: userModel } = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config();

const userController = {
    // cadastro
    create: async (req, res) => {
        const user = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
            age: req.body.age,
        }

        if (!user.name) {
            return res.status(422).json({ msg: 'O nome é obrigatório' })
        }
        if (!user.email) {
            return res.status(422).json({ msg: 'O email é obrigatório' })
        }
        if (!user.password) {
            return res.status(422).json({ msg: 'A senha é obrigatória' })
        }

        const userExists = await userModel.findOne({ email: user.email })
        if (userExists) {
            return res.status(422).json({ msg: "Este email já está cadastrado" })
        }

        // criptografia de senha
        const salt = await bcrypt.genSalt(12)
        user.password = await bcrypt.hash(user.password, salt)

        try {
            const response = await userModel.create(user);
            res.status(201).json({ response, msg: "Usuário criado com sucesso!" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    // login
    login: async (req, res) => {
        const login = {
            email: req.body.email,
            password: req.body.password,
        }

        if (!login.email) {
            return res.status(422).json({ msg: 'O email é obrigatório' })
        }
        if (!login.password) {
            return res.status(422).json({ msg: 'A senha é obrigatória' })
        }

        const user = await userModel.findOne({ email: login.email })

        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" })
        }

        const checkPassword = await bcrypt.compare(login.password, user.password)

        if (!checkPassword) {
            return res.status(422).json({ msg: 'Senha inválida!' })
        }

        try {
            const secret = process.env.SECRET
            const token = jwt.sign(
                {
                    id: user._id,
                },
                secret,
            )

            res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token })
        }
        catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    user: async (req, res) => {
        const id = req.params.id

        const user = await userModel.findById(id, '-password')

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' })
        }

        res.status(200).json({ user })
    }
};

module.exports = userController;