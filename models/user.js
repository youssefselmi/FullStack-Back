
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    firstName: {
        type: String,
        trim: true,
        required : true
        
    },
    lastName: {
        type: String,
        trim: true,
        required : true
    },
    email: {
        type: String,
        trim: true,
        required : true,
        unique : true
       
         
    },
    password: {
        type: String,
        required:true,
         
    },
    additionalInfo: {
        type : Boolean,
        required : true,
        default : false
    },
    accountState: {
        type : [{
            type : String,
            enum : [ 'Active', 'Banned']
        }],
        default : ['Active']
    },
    roles: {
        type: [{
            type: String,
            enum: ['user','premiumUser', 'admin']
        }],
        default: ['user']
    },
     location : {
         type : String,
     },
     interests : {
         type : [ String]
     },
     profession : {
         type : String,
     },
    avatar:{
        type: String,
        default :""
    },
    verified:{
        type : Boolean,
        default : false,
        required : true
    }
    

});

 
  


  

  module.exports = mongoose.model("User", UserSchema);
  