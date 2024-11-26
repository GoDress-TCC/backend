const { Outfit: OutfitModel } = require("../models/Outfit");
const { Clothing: clothingModel } = require("../models/Clothing");
const axios = require("axios");
const chroma = require("chroma-js");
const dotenv = require('dotenv')

dotenv.config();

const isDayTime = (hour = new Date().getHours()) => {
    const currentHour = hour.toString().split(":")[0];
    return currentHour >= 6 && currentHour < 18;
};

const getCityCoordinates = async (cityName) => {
    try {
        const response = await axios.get(
            `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
        );

        if (response.data.length === 0) {
            throw new Error("Cidade não encontrada");
        }

        const { lat, lon } = response.data[0];
        return { lat, lon };
    } catch (error) {
        console.log("Erro ao obter coordenadas da cidade");
        throw new Error(error.message);
    }
};

const getWeatherForecast = async (cityName, date) => {
    const { lat, lon } = await getCityCoordinates(cityName);
    const unixDate = Math.floor(new Date(date).getTime() / 1000);

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&dt=${unixDate}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
        );

        const closestForecast = response.data.list.reduce((closest, current) => {
            const timeDiff = Math.abs(current.dt - unixDate);
            const closestDiff = Math.abs(closest.dt - unixDate || Infinity);
            return timeDiff < closestDiff ? current : closest;
        }, {});

        let temperatureCategoty;

        if (!closestForecast) {
            temperatureCategoty = "mild";
            throw new Error("Não foi possível encontrar uma previsão próxima");
        }

        const temperature = closestForecast.main.temp;
        console.log(temperature);

        if (temperature < 15) {
            temperatureCategoty = "cold";
        }
        if (temperature >= 15 && temperature < 25) {
            temperatureCategoty = "mild";
        }
        if (temperature >= 25) {
            temperatureCategoty = "hot";
        }

        return temperatureCategoty;
    } catch (error) {
        console.log("Erro ao obter temperatura");
        console.log({ lat, lon, unixDate });
        throw new Error(error.message);
    }
};

const complementaryColors = (color1, color2, isDay) => {
    const distance = chroma.distance(color1, color2, 'lab');
    const tolerance = isDay ? 50 : 60;
    return distance < tolerance;
};

const calculateCompatibilityScore = (currentOutfit, newClothing, isDay) => {
    let score = 0;

    const iluminance = chroma(newClothing.color).luminance();
    if ((isDay && iluminance > 0.5) || (!isDay && iluminance <= 0.5)) score += 2;

    if (currentOutfit.every(item => complementaryColors(item.color, newClothing.color, isDay))) score += 2;

    if (currentOutfit.every(item => item.gender === newClothing.gender)) score += 1;
    if (currentOutfit.every(item => item.tissue === newClothing.tissue)) score += 1;
    if (currentOutfit.every(item => item.style === newClothing.style)) score += 1;
    if (currentOutfit.every(item => item.temperature === newClothing.temperature)) score += 1;

    return score;
};

const outfitController = {
    generate_outfit: async (req, res) => {
        try {
            const { clothingId, catId, style, temperature, fav, hour, location, generateMultiple = false } = req.body;
            const userId = req.user.id;

            const filteredClothingIds = Array.isArray(clothingId)
                ? clothingId.filter(id => id !== undefined && id !== null)
                : [];

            const query = { userId };
            if (catId) query.catId = catId;
            if (style) query.style = style;
            if (temperature) {
                if (temperature === "hot" || temperature === "cold") {
                    query.temperature = temperature;
                } else if (temperature === "current") {
                    const currentTemperature = await getWeatherForecast(location, new Date());
                    if (currentTemperature !== "mild") {
                        query.temperature = currentTemperature;
                    }
                } else {
                    const currentTemperature = await getWeatherForecast(location, temperature);
                    if (currentTemperature !== "mild") {
                        query.temperature = currentTemperature;
                    }
                }
            }
            if (fav) query.fav = fav;

            const clothes = await clothingModel.find(query);

            if (clothes.length === 0) return res.status(400).json({ msg: "Nenhuma roupa encontrada para o usuário" });

            const isDay = hour ? isDayTime(hour) : isDayTime();
            const outfits = [];
            const maxOutfits = generateMultiple ? 3 : 1;

            for (let i = 0; i < maxOutfits; i++) {
                let currentOutfit = [];
                if (filteredClothingIds.length > 0) {
                    currentOutfit = clothes.filter(item => filteredClothingIds.includes(item._id.toString()));
                } else {
                    currentOutfit = [clothes[Math.floor(Math.random() * clothes.length)]];
                }

                const missingTypes = ['upperBody', 'lowerBody', 'footwear'];
                const outfitWithMissingPieces = [...currentOutfit];

                for (const type of missingTypes) {
                    if (!currentOutfit.some(item => item.type === type)) {
                        const potentialClothes = clothes.filter(item => item.type === type);

                        let bestClothing = null;
                        let highestScore = -1;

                        potentialClothes.forEach(clothing => {
                            const score = calculateCompatibilityScore(currentOutfit, clothing, isDay);

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

                if (outfitWithMissingPieces.length >= 3) {
                    const orderedOutfit = outfitWithMissingPieces.sort((a, b) => {
                        const order = ['upperBody', 'lowerBody', 'footwear'];
                        return order.indexOf(a.type) - order.indexOf(b.type);
                    });

                    outfits.push(orderedOutfit);
                }


                clothes.splice(clothes.findIndex(item => outfitWithMissingPieces.includes(item)), outfitWithMissingPieces.length);
                if (clothes.length < 3) break;
            }

            if (outfits.length === 0) return res.status(400).json({ msg: "Não foi possível gerar o outfit, peças insuficientes" });

            const response = generateMultiple
                ? { msg: "Outfits gerados com sucesso", hour: isDay, outfits }
                : { msg: "Outfit gerado com sucesso", hour: isDay, outfit: outfits[0] };

            res.status(200).json(response);
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
    },
    outfits: async (req, res) => {
        try {
            const userId = req.user.id;

            const outfits = await OutfitModel.find({ userId }).populate("clothingId");

            res.status(200).json(outfits);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = outfitController;
