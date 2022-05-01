const mongoose = require('mongoose');
const Composant = require('./composant');



var Schema = mongoose.Schema;
var Piece = new Schema({
    NamePiece: String,
    Image: String,
    Prix: Number,
    Gategorie: String,
    Description: String,
    Livraison: String,
    DateFabricaion: Date,
    Marque: String
    //composants: [Composant]


});
module.exports = mongoose.model('pieces', Piece);