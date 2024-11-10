const { Event: eventModel } = require('../models/Event');

const eventController = {
    create: async (req, res) => {
        try {
            const { outfitId, image, name, description, date } = req.body;
            const userId = req.user.id;

            if (!name) return res.status(400).json({ msg: "Nome é obrigatório" });
            if (!date) return res.status(400).json({ msg: "Data é obrigatória" });

            const currentDate = new Date();
            if (new Date(date) < currentDate) return res.status(400).json({ msg: "Data inválida" });

            const newEvent = {
                userId: userId,
                outfitId,
                image,
                name,
                description,
                date,
            };

            const response = await eventModel.create(newEvent);
            res.status(201).json({ response, msg: "Evento cadastrado com sucesso!" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    events: async (req, res) => {
        try {
            const userId = req.user.id;
            const events = await eventModel.find({ userId });

            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const updatedFields = req.body;
            const userId = req.user.id;

            const updateEvent = await eventModel.findOneAndUpdate(
                { _id: req.params.id, userId },
                { $set: updatedFields },
                { new: true }
            );

            if (!updateEvent) return res.status(404).json({ msg: "Evento não encontrado" });

            res.status(200).json({ msg: 'Evento atualizado com sucesso!', updateEvent });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const userId = req.user.id;

            const deletedEvent = await eventModel.findOneAndDelete({ _id: req.params.id, userId });

            if (!deletedEvent) return res.status(404).json({ msg: "Evento não encontrado" });

            res.status(200).json({ msg: 'Evento deletado com sucesso!', deletedEvent });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
};

module.exports = eventController;