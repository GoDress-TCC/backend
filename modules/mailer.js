const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config();

const transport = nodemailer.createTransport({  
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

module.exports = transport;