const express = require("express");
const router = express.Router();
const adminContoller = require('../controllers/admin.controller')
const adminGuard = require("../guards/admin.guard")
const jwtHandling = require ("../services/jwt")

router.post("/addAdmin",[jwtHandling.jwtVerify , adminGuard],adminContoller.addAdmin)
router.get("/roles",adminContoller.getAllRoles)

module.exports = router;
