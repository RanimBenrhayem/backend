const express = require("express");
const { getUsersById } = require("../controllers/user.controller");
const AdminEmail = require("../services/adminEmailService")
const router = express.Router();
const userController = require("../controllers/user.controller");
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/files/:userId" , userController.getAllFilesForOneUser)
router.delete("/deleteuser/:id", userController.deleteuser);
router.get("/userslist", userController.userslist);
router.put("/updateuser/:id", userController.updateuser);
router.get('/userById/:userId',userController.getUsersById)
router.post('/sendEmail/',AdminEmail)
router.post("/googlesignin", userController.googlesignin);

/*

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.post("/googlesignin", userController.googlesignin);
router.post("/deleteuser/:id", userController.deleteuser);
router.get("/userslist", userController.userslist);
router.post("/updateuser/:id", userController.updateuser);

 */

//files uploaded (json format)
module.exports = router;
