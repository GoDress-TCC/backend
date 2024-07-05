const mongoose = require('mongoose')

const clotheSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cat'
    },
    image: {
        type: String,
    },
    type: {
        type: String,
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
    fit: {
        type: String,
    },
    gender: {
        type: String
    }
}, { timestamps: true });

const Clothe = mongoose.model('Clothe', clotheSchema)

module.exports = {
    Clothe,
    clotheSchema,
};