const mongoose = require('mongoose')
//le modele "user" de la base Mango
const schema = new mongoose.Schema({
    email : String ,
    password : String,
    firstName :String,
    lastName:String,
    phoneNumber : String,
    roleId : {type: mongoose.Schema.Types.ObjectId, ref: 'roles'},
  
 

    
})
const Model = mongoose.model('user', schema); //nom du model : user

module.exports = Model