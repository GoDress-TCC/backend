const { Cat: catModel } = require('../models/Cat');

const catController = {
    create: async (req, res) => {
        try {
            const { name } = req.body;
            const userId = req.user.id;

            if (!name) return res.status(400).json({ msg: "Nome é obrigatório" });

            const catExists = await catModel.findOne({ userId, name })
            if (catExists) return res.status(422).json({ msg: "Esta categoria já está cadastrada" })

            const newCat = {
                userId: userId,
                name
            };

            const response = await catModel.create(newCat);
            res.status(201).json({ response, msg: "Categoria criada com sucesso!" });
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    cats: async (req, res) => {
        try {
            const cats = await catModel.find({ userId: req.user.id });

            res.status(200).json(cats);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const { name } = req.body;
            const userId = req.user.id;

            const cat = await catModel.findOne({ _id: req.params.id, userId });
            if (!cat) return res.status(404).json({ msg: "Categoria não encontrada" });

            const catExists = await catModel.findOne({ name });
            if (catExists) return res.status(422).json({ msg: "Esta categoria já está cadastrada" });

            cat.name = name;

            await cat.save();

            res.status(200).json({ msg: "Categoria atualizada com sucesso" });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const cat = await catModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
            if (!cat) return res.status(404).json({ msg: "Categoria não encontrada" });

            res.status(200).json({ msg: "Categoria deletada com sucesso" })
        }
        catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }
};

module.exports = catController;