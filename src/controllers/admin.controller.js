const StatusCodes =  require ("http-status-codes");
const userModel = require('../models/user.model')
const userDao = require ('../dao/user.dao'); 
const passwordService = require("../services/passwordService");
const sendMail = require ('../services/mailService')
const validate = require ('../services/verification');
const roleDao = require("../dao/role.dao");

class adminContoller {

   async addAdmin (req,res){

    try {
        const {firstName,lastName,phoneNumber,email,password} = req.body;//retreiving attributes from request's body
        const validationResult =  await validate({firstName,lastName,phoneNumber,email,password})
        if (validationResult.success===false){
            return res.status(StatusCodes.BAD_REQUEST).json(validationResult.msg)
        }
       
        // console.log(req)
         const exist =   await userDao.findUserByEmail(email) //exist contient le resultat de la fonction finduserbyemail
         const phoneNumberexists =   await userDao.findUserByPhoneNumber(phoneNumber) //phoneNumberexists contient le resultat de la fonction finduserbyphonenumber
         //condition sur email et phonenumber
         if ((exist.data) && (phoneNumberexists.data)) {
            return res.status(StatusCodes.BAD_REQUEST).json('this email and this phone number are already in use')
        }
        //condition sur email
          if (exist.success===false){
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error during account creation') //probleme dans le serveur
          }
          if (exist.data){
              return res.status(StatusCodes.BAD_REQUEST).json('this email is already in use') //email utilisé
          }
         //condition sur phone number
          if (phoneNumberexists.success===false){
              return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error during account creation') //probleme dans le serveur
          }
          if (phoneNumberexists.data){
              return res.status(StatusCodes.BAD_REQUEST).json('this phone number is already in use') //numero utilisé
          }

          const role = await roleDao.getRoleByName('admin')
          if (role.success===false){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error ')
          }
          if (!role.data) {
            return res.status(StatusCodes.NOT_FOUND).json('error')
          }

          
          const passwordProcess = await passwordService.encryption(password)
          if (passwordProcess.success===false){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error during account creation')

          }
          
         //enregistrement user dans la base 
        const user = new userModel ({firstName,lastName,phoneNumber,email,password : passwordProcess.data,roleId:role.data._id})
        await user.save()
        const mail = sendMail(email)

      return   res.status(StatusCodes.CREATED).json("account created successfully")
    } catch (error) {
        console.log(error)
       return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error during account creation, please try again later")
        
    }

} 

async getAllRoles(req,res){
    try {
        const roles = await roleDao.getAllRoles()
        if (roles.success===false){
            return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error")

        }
        return   res.status(StatusCodes.OK).json(roles.data)

    } catch (error) {
        console.log(error)
        return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error")

    }

}


}
module.exports = new adminContoller()