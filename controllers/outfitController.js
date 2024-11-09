const { Outfit: OutfitModel } = require("../models/Outfit");
const { Clothing: clothingModel } = require("../models/Clothing");
const chroma = require("chroma-js");

const isDayTime = (hour = new Date().getHours()) => {
    return hour >= 6 && hour < 18;
};

const complementaryColors = (color1, color2, isDay) => {
    const distance = chroma.distance(color1, color2, 'lab');
    const tolerance = isDay ? 50 : 60;
    return distance < tolerance;
};

const calculateCompatibilityScore = (currentOutfit, newClothing, style, temperature, isDay) => {
    let score = 0;

    const iluminance = chroma(newClothing.color).luminance();
    if ((isDay && iluminance > 0.5) || (!isDay && iluminance <= 0.5)) score += 2;

    if (currentOutfit.every(item => complementaryColors(item.color, newClothing.color, isDay))) score += 2;

    if (currentOutfit.every(item => item.gender === newClothing.gender)) score += 1;
    if (currentOutfit.every(item => item.tissue === newClothing.tissue)) score += 1;
    if (style && newClothing.style === style) score += 3;
    if (temperature && newClothing.temperature === temperature) score += 3;

    return score;
};

const outfitController = {
    generate_outfit: async (req, res) => {
        try {
            const { clothingId, catId, style, temperature, fav, hour } = req.body;
            const userId = req.user.id;

            const filteredClothingIds = Array.isArray(clothingId)
                ? clothingId.filter(id => id !== undefined && id !== null)
                : [];

            const query = { userId };
            if (catId) query.catId = catId;
            if (style) query.style = style;
            if (temperature) query.temperature = temperature;
            if (fav) query.fav = fav;

            const clothes = await clothingModel.find(query);
            if (clothes.length === 0) return res.status(400).json({ msg: "Nenhuma roupa encontrada para o usuário" });

            let currentOutfit = [];
            if (filteredClothingIds.length > 0) {
                currentOutfit = clothes.filter(item => filteredClothingIds.includes(item._id.toString()));
            } else {
                currentOutfit = [clothes[Math.floor(Math.random() * clothes.length)]];
            }

            const isDay = hour ? isDayTime(hour) : isDayTime();  

            const missingTypes = ['upperBody', 'lowerBody', 'footwear'];
            const outfitWithMissingPieces = [...currentOutfit];

            for (const type of missingTypes) {
                if (!currentOutfit.some(item => item.type === type)) {
                    const potentialClothes = clothes.filter(item => item.type === type);

                    let bestClothing = null;
                    let highestScore = -1;

                    potentialClothes.forEach(clothing => {
                        const score = calculateCompatibilityScore(currentOutfit, clothing, style, temperature, isDay);

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

            if (outfitWithMissingPieces.length < 3) return res.status(400).json({ msg: "Não foi possível completar o outfit, peças insuficientes" });

            res.status(200).json({ msg: "Outfit gerado com sucesso", outfit: outfitWithMissingPieces });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },

    save_outfit: async (req, res) => {
        try {
            const { clothingId, catId, name, style, temperature, hour } = req.body;
            const userId = req.user.id;

            const filteredClothingIds = Array.isArray(clothingId)
                ? clothingId.filter(id => id !== undefined && id !== null)
                : [];

            if (filteredClothingIds.length === 0) {
                return res.status(400).json({ msg: "Roupas são obrigatórias" });
            }

            const outfitExists = await OutfitModel.findOne({ userId, clothingId: filteredClothingIds });
            if (outfitExists) return res.status(422).json({ msg: "Este outfit já está cadastrado" });

            const newOutfit = {
                userId: userId,
                clothingId: filteredClothingIds,
                catId,
                name,
                style,
                temperature,
                hour,
            };

            const response = await OutfitModel.create(newOutfit);
            res.status(201).json({ response, msg: "Outfit cadastrado com sucesso!" });
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = outfitController;
