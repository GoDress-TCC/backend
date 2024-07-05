const mongoose = require('mongoose')

const outfitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clotheId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clothe',
        required: true 
    }],
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cat'
    },
    name: {
        type: String,
    },
    description : {
        type: String
    },
    fav: {
        type: Boolean
    }
}, { timestamps: true });

const Outfit = mongoose.model('Outfit', outfitSchema)

module.exports = {
    Outfit,
    outfitSchema,
};