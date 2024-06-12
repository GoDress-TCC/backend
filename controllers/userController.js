const { response } = require('express');
const { User: userModel } = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const crypto = require('crypto')
const mailer = require('../modules/mailer')

dotenv.config();

const userController = {
    // cadastro
    create: async (req, res) => {
        try {
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

            const response = await userModel.create(user);
            res.status(201).json({ response, msg: "Usuário criado com sucesso!" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    // login
    login: async (req, res) => {
        try {
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
        try {
            const id = req.params.id

            const user = await userModel.findById(id, '-password')

            if (!user) {
                return res.status(404).json({ msg: 'Usuário não encontrado!' })
            }

            res.status(200).json({ user })
        }
        catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },

    forgot_password: async (req, res) => {
        try {
            const fpassword = {
                email: req.body.email
            }

            const user = await userModel.findOne({ email: fpassword.email })

            if (!user) {
                return res.status(404).json({ msg: "Usuário não encontrado" })
            }

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()
            now.setHours(now.getHours() + 1)

            await userModel.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            })

            mailer.sendMail({
                to: user.email,
                from: 'lucas12chves@gmail.com',
                template: 'auth/forgot_password',
                context: { token }
            })

        }
        catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }
};

module.exports = userController;