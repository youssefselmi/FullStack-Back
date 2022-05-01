const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Need = new Schema({
    CodeP: String,
    Email: String,
    SearchFor: String
});
module.exports = mongoose.model('needs', Need);

    