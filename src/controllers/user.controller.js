const StatusCodes =  require ("http-status-codes");
const userModel = require('../models/user.model')
const userDao = require ('../dao/user.dao'); 
const passwordService = require("../services/passwordService");
const sendMail = require ('../services/mailService')
const validate = require ('../services/verification');
const roleDao = require("../dao/role.dao");

class UserController {
    //fonction asynchrone signup
    async signup (req,res){
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
              
              const passwordProcess = await passwordService.encryption(password)
              if (passwordProcess.success===false){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error during account creation')

              }
              const role = await roleDao.getRoleByName('client')
              if (role.success===false){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error ')
              }
              if (!role.data) {
                return res.status(StatusCodes.NOT_FOUND).json('error')
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
               const mail = sendMail(email)

            return res.status(StatusCodes.OK).json(`Welcome ${userexists.data.firstName} ${userexists.data.lastName}`)
      } catch (error) {
          console.log(error)
          return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error during the sign in, please try again later")
          
      }
    }
   //affichage de uploaded files (json format)
    async getAllFilesForOneUser(req,res) {
        try{
            const userId = req.params.userId;
            const userExists = await userDao.findUserById(userId);
            if(userExists.success===false){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).status("error")
            }
            if(!userExists.data) {
                return res.status(StatusCodes.NOT_FOUND).status("no user found with this id")
            }

            return res.status(StatusCodes.OK).json(userExists.data.uploadedFiles)


        }catch(error){
                console.log(error)
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).status("error")
        }
    }


    async userslist(req, res, next) {
       try {
         const users = await userModel.find().populate('roleId').exec()
         if (!users){
          return res.status(StatusCodes.NOT_FOUND).json("Users not Found")
         }
         return res.status(StatusCodes.OK).json(users)
       } catch (error) {
         console.log(error)
         
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('error')
       }
      }
      async deleteuser(req, res, next) {
        userModel.findByIdAndRemove(req.params.id, (error, data) => {
          if (error) {
            return next(error);
          } else {
            res.status(200).json({
              msg: data,
            });
          }
        });
      }
      async updateuser(req, res, next) {
        const {firstName,lastName,phoneNumber,email,password} = req.body;//retreiving attributes from request's body
            const validationResult =  await validate({firstName,lastName,phoneNumber,email,password})
            if (validationResult.success===false){
                return res.status(StatusCodes.BAD_REQUEST).json(validationResult.msg)
              }
        userModel.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          (error, data) => {
            if (error) {
              return next(error);
            } else {
              res.json(data);
              console.log("User updated successfully !");
            }
          }
        );
      }

      async getUsersById(req,res){
     try {
   const    userId = req.params.userId
      const usersById = await userDao.findUserById(userId);
      if (usersById.success===false){
        return res.status(StatusCodes.BAD_REQUEST).json('can not get users')
     
      }
           if(!usersById.data){
             return res.status(StatusCodes.NOT_FOUND).json('user not found')           }

             return res.status(StatusCodes.OK).json(usersById.data)

     } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json('error..please try again')
     }



      }

 





}
module.exports = new UserController()