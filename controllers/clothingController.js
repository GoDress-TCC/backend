const { Clothing: clothingModel } = require('../models/Clothing');
const { removeBackgroundFromImageUrl } = require('remove.bg');
const { bucket } = require('../db/firebase/firebaseConfig')
const { v4: uuiv4 } = require('uuid');

const clothingController = {
    create: async (req, res) => {
        try {
            const { catId, image, kind, type, color, style, temperature, gender, tissue, fav } = req.body;
            const userId = req.user.id;

            if (!image) return res.status(400).json({ msg: "Imagem é obrigatória" });
            if (!kind) return res.status(400).json({ msg: "Tipo é obrigatório" });
            if (!color) return res.status(400).json({ msg: "Cor é obrigatória" });
            if (!style) return res.status(400).json({ msg: "Estio é obrigatório" });
            if (!gender) return res.status(400).json({ msg: "Gênero é obrigatório" });
            if (!temperature) return res.status(400).json({ msg: "Temperatura é obrigatório" });
            if (!type) return res.status(400).json({ msg: "Type é obrigatório" });

            const clothingExists = await clothingModel.findOne({ userId, image })
            if (clothingExists) return res.status(422).json({ msg: "Esta roupa já está cadastrada" })

            const newClothing = {
                userId: userId,
                catId, 
                image, 
                kind, 
                type, 
                color, 
                style, 
                temperature, 
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
    clothes: async (req, res) => {
        try {
            const clothes = await clothingModel.find({ userId: req.user.id });

            res.status(200).json(clothes);
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const ids = req.params.id.split(',');
            const userId = req.user.id;
            const updatedFields = req.body;

            const updateClothing = await clothingModel.updateMany({ _id: { $in: ids }, userId }, updatedFields);

            if (!updateClothing) return res.status(404).json({ msg: "Roupa não encontrada" });

            res.status(200).json({ msg: 'Roupa atualizada com sucesso!', updateClothing });
        }
        catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    delete: async (req, res) => {
        try {
            const ids = req.params.id.split(',');
            
            const deleteClothes = await clothingModel.deleteMany({ _id: { $in: ids }, userId: req.user.id });
            if (!deleteClothes) return res.status(404).json({ msg: "Roupa não encontrada!" });

            res.status(200).json({ msg: `Roupa${ids.length > 1 ? "s" : ""} deletada${ids.length > 1 ? "s" : ""} com sucesso!` })
        }
        catch (error) {
            res.status(500).json({ msg: error.message })
        }
    },
    remove_background: async (req, res) => {
        try {
            const { image } = req.body;

            if(!image) return res.status(400).json({ msg: "Imagem é obrigatória" });
        
            const response = await removeBackgroundFromImageUrl({
                url: image,
                apiKey: process.env.REMOVEBG_KEY,
                size: 'auto',
                type: 'auto',
                format: 'auto'
            });

            const base64img = response.base64img;
            const buffer = Buffer.from(base64img, 'base64');

            const fileName = `${uuiv4()}.png`;
            const file = bucket.file(`images/${fileName}`);

            await file.save(buffer, {
                metadata: { contentType: 'image/png' },
                public: true,
            })

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/images/${fileName}`;

            res.status(200).json({ msg: "Imagem processada e enviada com sucesso", imageUrl: publicUrl })
        }
        catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }   
}

module.exports = clothingController;
