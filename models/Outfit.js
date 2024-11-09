const mongoose = require('mongoose')

const outfitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clothingId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clothing',
        required: true 
    }],
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cat' 
    },
    name: {
        type: String,
    },
    style: {
        type: String,
    },
    temperature: {
        type: String
    },
    hour: {
        type: String
    }
}, { timestamps: true });

const Outfit = mongoose.model('Outfit', outfitSchema)

module.exports = {
    Outfit,
    outfitSchema,
};