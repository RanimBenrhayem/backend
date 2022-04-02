const StatusCodes =  require ("http-status-codes");
const userModel = require('../models/user.model')
const userDao = require ('../dao/user.dao'); 
const passwordService = require("../services/passwordService");


class UserController {
    //fonction asynchrone signup
    async signup (req,res){
        try {
            const {firstName,lastName,phoneNumber,email,password} = req.body; //retreiving attributes from request's body
            console.log(req)
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
              
              const passwordProcess = await passwordService.encryption(password)
              if (passwordProcess.success===false){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error during account creation')

              }
              
             //enregistrement user dans la base 
            const user = new userModel ({firstName,lastName,phoneNumber,email,password : passwordProcess.data})
            await user.save()
       


          return   res.status(StatusCodes.CREATED).json("account created successfully")
        } catch (error) {
            console.log(error)
           return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error during account creation, please try again later")
            
        }
       
 
    } 
    //la fonction asynchrone signin
    async signin (req,res){
      try {
        const {email,password} = req.body;
        const userexists =   await userDao.findUserByEmail(email) 
            if (userexists.success===false){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error during Sing in')

            }
             if (userexists.data== null) {
                return res.status(StatusCodes.BAD_REQUEST).json('verifier votre email')
            }
            const decryptedPaswword = await passwordService.decryption(userexists.data.password,password)
               if (decryptedPaswword.success===false){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error during Sing in')


               }
               if (!decryptedPaswword.data ){
                return res.status(StatusCodes.FORBIDDEN).json('mot de passe incorrect')
               }

            return res.status(StatusCodes.OK).json(`Welcome ${userexists.data.firstName} ${userexists.data.lastName}`)
      } catch (error) {
          console.log(error)
          return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error during the sign in, please try again later")
          
      }
    }
}
module.exports = new UserController()