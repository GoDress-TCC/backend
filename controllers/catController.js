const { Cat: catModel } = require('../models/Cat');

const catController = {
    create: async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) return res.status(400).json({ msg: "Nome é obrigatório" });

            const catExists = await catModel.findOne({ name })
            if (catExists) return res.status(422).json({ msg: "Esta categoria já está cadastrada" })

            const newCat = {
                userId: req.user.id,
                name
            };

            const response = await catModel.create(newCat);
            res.status(201).json({ response, msg: "Categoria criada com sucesso!" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = catController;