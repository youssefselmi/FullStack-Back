const mongoose = require('mongoose');


let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
// current minutes
let minutes = date_ob.getMinutes();
let added=(date+ "/" + month + "/" + year + ":"+  + hours + ":" + minutes );

var Schema = mongoose.Schema;
var Besoin = new Schema({
    Name: String,
    Email: String,
    Besoinrecherche: String,
    Datepostulation: {  
        type: 'String', default: added, required: true },
});
module.exports = mongoose.model('besoins', Besoin);

    