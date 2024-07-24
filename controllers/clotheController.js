const { Clothe: clotheModel } = require('../models/Clothe');

const clotheController = {
    create: async (req, res) => {
        try {
            const { catId, image, kind, color, size, fit, gender } = req.body;
            const userId = req.user.id;

            if (!image) return res.status(400).json({ msg: "Imagem é obrigatória" });
            if (!kind) return res.status(400).json({ msg: "Tipo é obrigatório" });
            if (!color) return res.status(400).json({ msg: "Cor é obrigatória" });

            const clotheExists = await clotheModel.findOne({ userId, image })
            if (clotheExists) return res.status(422).json({ msg: "Esta roupa já está cadastrada" })

            const newClothe = {
                userId: userId,
                catId, 
                image,
                kind,
                color,
                size,
                fit,
                gender
            };

            const response = await clotheModel.create(newClothe);
            res.status(201).json({ response, msg: "Roupa cadastrada com sucesso!" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
}

module.exports = clotheController;
