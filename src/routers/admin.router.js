const express = require("express");
const router = express.Router();
const adminContoller = require('../controllers/admin.controller')

router.post("/addAdmin",adminContoller.addAdmin)
router.get("/roles",adminContoller.getAllRoles)

module.exports = router;
