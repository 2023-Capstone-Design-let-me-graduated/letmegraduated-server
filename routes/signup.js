const express = require("express");
const { emailForSignUp, emailForWithdrawal } = require("../controller/email");
const router = express.Router();

router.get("/", emailForSignUp, (req,res,next)=>res.send(req.secret));

module.exports = router;