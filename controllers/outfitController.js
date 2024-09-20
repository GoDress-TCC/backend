const { Outfit: OutfitModel } = require("../models/Outfit");
const { Clothing: clothingModel } = require("../models/Clothing");
const chroma = require("chroma-js");

const complementaryColors = (color1, color2) => {
    const distance = chroma.distance(color1, color2, 'lab');
    return distance < 50;
};

const calculateCompatibilityScore = (currentOutfit, newClothing, style, temperature) => {
    let score = 0;

    if (currentOutfit.every(item => complementaryColors(item.color, newClothing.color))) {
        score += 2;
    }

    if (currentOutfit.every(item => item.gender === newClothing.gender)) {
        score += 1;
    }

    if (currentOutfit.every(item => item.tissue === newClothing.tissue)) {
        score += 1;
    }

    if (style && newClothing.style === style) {
        score += 3;
    }

    if (temperature && newClothing.temperature === temperature) {
        score += 3;
    }

    return score;
};

const outfitController = {
    generate_outfit: async (req, res) => {
        try {
            const { clothingId, catId, style, temperature, fav } = req.body;
            const userId = req.user.id;

            const query = { userId };

            if (catId) {
                query.catId = catId;
            }

            if (style) {
                query.style = style;
            }

            if (temperature) {
                query.temperature = temperature;
            }

            if (fav) {
                query.fav = fav
            }

            const clothes = await clothingModel.find(query);


            if (clothes.length === 0) {
                return res.status(400).json({ msg: "Nenhuma roupa encontrada para o usuário" });
            }

            let currentOutfit = [];

            if (clothingId && clothingId.length > 0) {
                currentOutfit = clothes.filter(item => clothingId.includes(item._id.toString()));
            } else {
                currentOutfit = [clothes[Math.floor(Math.random() * clothes.length)]];
            }

            if (currentOutfit.length === 0) {
                currentOutfit = [];
            }

            const missingTypes = ['upperBody', 'lowerBody', 'footwear'];
            const outfitWithMissingPieces = [...currentOutfit];

            for (const type of missingTypes) {
                if (!currentOutfit.some(item => item.type === type)) {
                    const potentialClothes = clothes.filter(item => item.type === type);

                    let bestClothing = null;
                    let highestScore = -1;

                    potentialClothes.forEach(clothing => {
                        const score = calculateCompatibilityScore(currentOutfit, clothing, style, temperature);

                        if (score > highestScore) {
                            highestScore = score;
                            bestClothing = clothing;
                        }
                    });

                    if (bestClothing) {
                        outfitWithMissingPieces.push(bestClothing);
                    }
                }
            }

            if (outfitWithMissingPieces.length < 3) {
                return res.status(400).json({ msg: "Não foi possível completar o outfit, peças insuficientes" });
            }

            res.status(200).json({ msg: "Outfit gerado com sucesso", outfit: outfitWithMissingPieces });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
    save_outfit: async (req, res) => {
        try {
            const { clothingId, catId, name, style, temperature } = req.body;
            const userId = req.user.id;

            if (!clothingId) return res.status(400).json({ msg: "Roupas são obrigatórias" });
            if (!name) return res.status(400).json({ msg: "Nome é obrigatório" });

            const outfitExists = await OutfitModel.findOne({ userId, clothingId });
            if (outfitExists) return res.status(422).json({ msg: "Este outfit já está cadastrado" });

            const newOutfit = {
                userId: userId,
                clothingId,
                catId,
                name,
                style,
                temperature
            };

            const response = await OutfitModel.create(newOutfit);
            res.status(201).json({ response, msg: "Outfit cadastrado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message })
        }
    }
};

module.exports = outfitController;
