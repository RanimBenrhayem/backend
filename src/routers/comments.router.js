const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments.controller");

router.post("/addcomment/:userId", commentsController.addComment);
router.post("/deletecomment/:id", commentsController.deletecomment);
router.get("/getcomment", commentsController.commentslist);
router.put("/updatecomment/:id", commentsController.updatecomment);

module.exports = router;