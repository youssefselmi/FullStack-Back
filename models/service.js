const mongoose = require('mongoose'); 



let ts = Date.now();

let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();
let added=(date+ "-" + month + "-" + year + "         "+  + hours + ":" + minutes );
var Schema = mongoose.Schema ; 
var serviceSchema = new mongoose.Schema({
    
    type:String,
    title:String,
    maxPart : Number,
    description : String,
    governorate :String,
    city: String,
    zipcode : Number,
    disponibility : String,
    weekend : String,
    day : String,
    night : String,
    addedat: { 
        
        type: 'String', default: added, required: true },
    signal:{type:'Number',default:0},
     
       
}); 

module.exports = mongoose.model('service',serviceSchema);