const { StatusCodes } = require("http-status-codes");
const userDao = require("../dao/user.dao");



class UploadController {

async uploadProcess(req,res) {
    try{
        const fileName = req.info.fileName ;
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

}


module.exports = new UploadController()