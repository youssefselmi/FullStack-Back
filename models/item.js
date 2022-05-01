const { Long } = require('mongodb')
const mongoose =require ('mongoose')


const itemSchema = new mongoose.Schema({
    
    itemName:{
        type :String,
        required: true

    },
    picture: {
        type : String,
        required: true
    },
    price:{
        type: String,
        required : true
    },
    categorie:{
        type: String,
        required : true
    },
    descreption:{
        type:String,
        required : false
    },
    favoris:{
        type:Boolean,
        required: false,
        default: false,
    }
}

)
module.exports = mongoose.model('Item',itemSchema)