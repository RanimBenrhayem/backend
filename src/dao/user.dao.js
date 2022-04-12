const userModel = require('../models/user.model') //importation du usermodel

class userDao {

    async findUserById(id) {
        try{
const result = await userModel.findById(id).exec()
return ({
    success : true ,
    data : result
})

        }catch(error){
            console.log(error)
            return ({
                success : false ,
                data : null
            })
        }
    }
    //recherche user par email
 async findUserByEmail (email){
     try {
        const result = await userModel.findOne({email: email}).exec();
        return ({
            success : true ,
            data : result
        })
     } catch (error) {
         console.log("error : ",error)
         return ({
            success : false ,
            data : null
        })
         
     }

 }

 //recherche user par numero de telephone
 async findUserByPhoneNumber (phoneNumber){
    try {
       const result = await userModel.findOne({phoneNumber : phoneNumber}).exec();
       return ({
           success : true ,
           data : result
       })
    } catch (error) {
        console.log("error : ",error)
        return ({
           success : false ,
           data : null
       })
        
    }
}

async addFileIntoTable(userId,fileName){

    try {
        const user = await userModel.findById(userId).exec()
        if(user ) {
            user.uploadedFiles = [...user.uploadedFiles , fileName] 
            await user.save()
            return {success:true}
            
        }
    } catch (error) {
        console.log(error)
        return {success:false}
    }

    





}














}




module.exports = new userDao()