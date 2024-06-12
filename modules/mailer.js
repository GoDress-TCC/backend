const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
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
    viewEngine: 'handlebars',
    viewPath: require('../resources/mail'),
    extName: '.html'
}))

module.exports = transport;