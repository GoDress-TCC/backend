const mongoose = require('mongoose')

const clothingSchema = new mongoose.Schema({
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
        required: true
    },
    kind: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    fit: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    tissue: {
        type: String
    },
    fav: {
        type: Boolean
    }
}, { timestamps: true });

const Clothing = mongoose.model('Clothing', clothingSchema)

module.exports = {
    Clothing,
    clothingSchema,
};