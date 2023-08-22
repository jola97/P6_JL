// Importation du package mongoose 
const mongoose = require('mongoose');

// Utilisation des méthodes Schema et model de Mongoose
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked:  { type: [String] },
    usersDisliked:  { type: [String] }
});

// Exportation du model
module.exports = mongoose.model('Sauce', sauceSchema);