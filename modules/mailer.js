const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config();

const transport = nodemailer.createTransport({  
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

module.exports = transport;