const userModel = require('../models/user.model')
const nodemailer = require ('nodemailer')


    function  adminEmailServices (req,res) {
    transporter = nodemailer.createTransport({
    service: 'outlook', 
    auth: {
    
    user: process.env.user_email,
    pass : process.env.user_password,

}})

    

    
console.log(req.body)


    const email = req.body.email
    const message = req.body.message
    const content = ` ${message} `
  
    var mail = {
      from: process.env.user_email , 
      to: email, 
      subject: '[Branper Admin]  ',
      message: message,
      text: content
    }
  
    transporter.sendMail(mail, (err) => {
      if (err) {
          console.log(err)
        res.json({
          status: 'fail'
        })
      } else {
        res.json({
         status: 'success'
      })
    }})
    }

      
module.exports = adminEmailServices 