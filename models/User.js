const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema)

module.exports = {
    User,
    userSchema,
};