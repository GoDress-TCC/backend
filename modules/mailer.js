const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

dotenv.config();

const transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

transport.use('compile', hbs({
    viewEngine: 'nodemailer-express-handlebars',
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html'
}))

module.exports = transport;