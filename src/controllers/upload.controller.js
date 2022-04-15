const { StatusCodes } = require("http-status-codes");
const userDao = require("../dao/user.dao");
const mongoose = require('mongoose');



class UploadController {
//aploaded files , fileName and originalfilename are added inot user table
async uploadProcess(req,res) {
    try{
        const fileName = req.info.fileName ;
        // console.log(req.info) 
        
        const originaleFileName = req.info.originaleFileName;
        const userId = req.params.userId;
        const {success} = await userDao.addFileIntoTable(userId , {fileName,originaleFileName})
        if(success) {
            return res.status(StatusCodes.OK).json("file uploaded successfully")
        }
        return res.status(StatusCodes.BAD_REQUEST).json("error occurred while uploading file , please try again!")
    }catch(error) {
 console.log(error);
 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error occurred while uploading file , please try again!!!")
    }
    

}
//return fileuploaded (table)
async getFileByFileName(req,res){
    const gfs = req.app.locals.gfs;
    const file = gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }
      
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
}



 
//delete file from file table and user table
async deleteFileFromDB (req, res) {
  const gfs = req.app.locals.gfs;
  const {idUser} = req.body;
  const result = await userDao.deleteAndUpdate(idUser,req.params.filename);
  if (result.success===false){
    return (res.status(StatusCodes.BAD_REQUEST).json(result.msg))
  }
  const file = gfs
  .find({
    filename: req.params.filename
  })
  .toArray((err, files) => {
    // console.log("aaaaaaaaaaaa")
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no files exist"
      });
    }
    console.log(files[0]._id)
    gfs.delete(files[0]._id, (err, data) => {
      if (err) return res.status(404).json({ err: err.message });
     
        return res.status(StatusCodes.OK).json("file deleted successfully!")
  })
})
 
  
   
}

 

  
}

module.exports = new UploadController()