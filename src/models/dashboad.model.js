const mongoose = require('mongoose')
//le modele "joinfiles table" de la base Mango
const schema = new mongoose.Schema({
    fileName: String ,
    attribut1 :String,
    attribut2:String,
    typeOfDashboard : String ,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
    

    


    
})
const Model = mongoose.model('dashboard', schema); //nom du model : joinfiles

module.exports =Model