const { Clothing: clothingModel } = require('../models/Clothing');

const clothingController = {
    create: async (req, res) => {
        try {
            const { catId, image, kind, color, fit, gender, tissue, fav } = req.body;
            const userId = req.user.id;

            if (!image) return res.status(400).json({ msg: "Imagem é obrigatória" });
            if (!kind) return res.status(400).json({ msg: "Tipo é obrigatório" });
            if (!color) return res.status(400).json({ msg: "Cor é obrigatória" });
            if (!fit) return res.status(400).json({ msg: "Caimento é obrigatório" });

            const clothingExists = await clothingModel.findOne({ userId, image })
            if (clothingExists) return res.status(422).json({ msg: "Esta roupa já está cadastrada" })

            const newClothing = {
                userId: userId,
                catId, 
                image,
                kind,
                color,
                fit,
                gender,
                tissue,
                fav
            };

            const response = await clothingModel.create(newClothing);
            res.status(201).json({ response, msg: "Roupa cadastrada com sucesso!" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
}

module.exports = clothingController;
