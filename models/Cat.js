const mongoose = require('mongoose')

const catSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Cat = mongoose.model('Cat', catSchema)

module.exports = {
    Cat,
    catSchema,
};