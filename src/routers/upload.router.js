const express = require("express");
const uploadController = require("../controllers/upload.controller");
const upload = require("../services/uploadService");
const uploadjoin = require("../services/joinUploadService");

const join = require ("../services/join");
const joinedFilesController = require("../controllers/joinedFiles.controller");

const router = express.Router();


router.post("/:userId" , upload.single("file") , uploadController.uploadProcess)//upload files
router.post("/join/add/:userId",uploadjoin.single('file'),uploadController.uploadProcess)
router.get("/:filename", uploadController.getFileByFileName) //file table
router.delete("/files/delete/:id/:userId",uploadController.deleteFileFromDB) //delete
router.post("/join/files",joinedFilesController.joinProcess)
router.get("/filesbyid/:id",uploadController.getFileById)
router.get('/file/join/allbyid/:id',joinedFilesController.getJoinedFilesById)
router.get('/files/getall/:userId',uploadController.getUserSingleFiles)
router.delete("/join/file/delete/:id/:userId",joinedFilesController.deleteJoinedFileFromDB)
router.get('/download/file/:id',uploadController.downloadFileById)
router.get('/files/joined/getall/:userId',joinedFilesController.getUserJoinedFiles)
router.get('/files/joined/getbyid/:id',joinedFilesController.downloadJoinedFileById)



//router.post("/:uploadType/:userId" , upload.single("file") , uploadController.uploadProcess) //upload files


module.exports = router;