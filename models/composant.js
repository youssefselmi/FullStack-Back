const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Composant = new Schema({
    Name: String,
    Etat: String,
    Marque: String,
    Description: String,
    Image: String,
    Prix: Number,
    Livraison: String, 
    UserId:String,
    
});
module.exports = mongoose.model('composants', Composant);

