const express = require("express");
const uploadController = require("../controllers/upload.controller");
const upload = require("../services/uploadService");
const join = require ("../services/join");
const joinedFilesController = require("../controllers/joinedFiles.controller");
const router = express.Router();


router.post("/:userId" , upload.single("file") , uploadController.uploadProcess) //upload files
router.get("/:filename", uploadController.getFileByFileName) //file table
router.delete("/files/delete/:filename",uploadController.deleteFileFromDB) //delete
router.post("/join/files",joinedFilesController.joinProcess)



module.exports = router;