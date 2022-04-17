const joinedFilesModel = require('../models/joinFiles.model')
const fileDao = require('../dao/file.dao')
const { StatusCodes } = require("http-status-codes");
const join = require ('../services/join')


class JoinedFilesContollers {
 
    async joinProcess(req,res){
        try {
            const {fileName1,fileName2,attribut1,attribut2,idUser} = req.body  
            const gfs = req.app.locals.gfs;
            let bufs = [];
            let result;
            let result2;
    //         const file1exists = await fileDao.findFileByFileName(gfs,fileName1)
    //         return res.json(file1exists)

    //         if (file1exists.success===false){
    //             return res.status(StatusCodes.NOT_FOUND).json(` File with this name : ${fileName1} not found`)
    //         }
    
    //   const file2exists = await fileDao.findFileByFileName(gfs,fileName2)
    //   if (file2exists.success===false){
    //     return res.status(StatusCodes.NOT_FOUND).json(` File with this name : ${fileName2} not found`)
    // }
     
    const file = gfs
    .find({
      filename: fileName1,
    })
    .toArray( (err, files) => {
      if (!files || files.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json(` File with this name : ${fileName1} not found`)

        
      }

    
    

      gfs
        .openDownloadStreamByName(fileName1)
        .on("data", (chunk) => {
          bufs.push(chunk);
        })
        .on("end", () => {
          const fbuf = Buffer.concat(bufs);
          result = fbuf.toString();
          bufs = []
          const find = gfs.find({
            filename: fileName2,
          }).toArray((err,files)=>{
            if (!files || files.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json(` File with this name : ${fileName2} not found`)
        
            }

            gfs.openDownloadStreamByName(fileName2).on("data" , chunk =>bufs.push(chunk))
            .on("end" , async()=>{
                const fbuf2= Buffer.concat(bufs)
                result2= fbuf2.toString()
                // return res.json({result,result2})
                const joinedFile = await join(result,result2,attribut1,attribut2)
                return res.json(joinedFile)

            })
          })


        });



    });
    // const joinedProcess = await join(fileName1,fileName2,attribut1,attribut2)
    //  if (joinedProcess.success===false){
    //      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('can not join files')
    //  }
    //  return res.status(StatusCodes.CREATED).json(joinedProcess.data)
    

          
    
        } catch (error) {
            console.log(error)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
            
        }
       




    }
    async saveJoinedFilesIntoDataBase(){


       
        const joined = await join(file1Name, file2Name, attribut1, attribut2)
        const joinedModel = new joinedFilesModel({fileName1,fileName2,attribut1,attribut2 ,fileName:success.data.joinedFileName})
        await joinedModel.save()
        return   res.status(StatusCodes.CREATED).json("Joined File uploaded successfully")
    } catch (error) {
        console.log(error)
       return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error during the join .. please try again")
        
    }
    }


      









module.exports = new JoinedFilesContollers()