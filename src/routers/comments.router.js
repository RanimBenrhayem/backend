const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments.controller");
const adminGuard = require("../guards/admin.guard")
const jwtHandling = require ("../services/jwt")

router.post("/addcomment/",[jwtHandling.jwtVerify , adminGuard], commentsController.addComment);
router.post("/deletecomment/:id", [jwtHandling.jwtVerify , adminGuard],commentsController.deletecomment);
router.get("/getcomment", [jwtHandling.jwtVerify , adminGuard],commentsController.commentslist);
//router.put("/updatecomment/:id", commentsController.updatecomment);

module.exports = router;