var express = require('express');
var router = express.Router();
const {emailForWithdrawal} = require('../controller/email');
// const {withdrawal}=require('../controller/db');

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.send(req.params.id); // 이걸로 다 바꿔야 함.
});

router.get('/logout',function(req,res,next){
  res.send('로그 아웃');
})

// router.get('/withdrawal',emailForWithdrawal,withdrawal);

module.exports = router;