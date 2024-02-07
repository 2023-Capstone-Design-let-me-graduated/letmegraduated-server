const express = require('express');
const { emailForSignUp, emailForWithdrawal } = require("../controller/email");
const router = express.Router();
const {createUser} = require("../controller/db");

// /signup/useremail
// emailForSignUp으로 res.send(해줘야함.)
router.get("/signup/:useremail", emailForSignUp, (req,res,next)=>res.send(req.secret));

// /signup
// createUser
router.post("/signup")

// /login
// query: userid랑 passward받아서 상태코드 보내기, 혹은 쿠키가 존재하면 자동 로그인
router.get('/login',(req,res,next)=>{
});

// logout

// /setting/:userid
// emailForWithdrawal 후에 userid 삭제
router.delete('/setting/:userid',(req,res,next)=>{

})

module.exports = router;