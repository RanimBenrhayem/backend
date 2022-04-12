const express = require("express");
const uploadController = require("../controllers/upload.controller");
const upload = require("../services/uploadService");
const router = express.Router();


router.post("/:userId" , upload.single("file") , uploadController.uploadProcess)
router.get("/:filename", uploadController.getFileByFileName)
router.delete("/files/delete/:id",uploadController.deleteFileFromDB)


module.exports = router;