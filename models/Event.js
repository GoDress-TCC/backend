const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    outfitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outfit',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dateTime: {
        type: Date,
        required: true
    },
    Image: {
        type: String
    }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema)

module.exports = {
    Event,
    eventSchema,
};