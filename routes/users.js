const express = require('express');
const router = express.Router();
const {emailForWithdrawal} = require('../controller/email');
const { renderUsers, rendCreatUser, renderuserid } = require('../controller/users');
// const {withdrawal}=require('../controller/db');

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.send(req.params.id); // 이걸로 다 바꿔야 함.
});

router.get('/logout',function(req,res,next){
  res.send('로그 아웃');
})

// router.get('/withdrawal',emailForWithdrawal,withdrawal);

// users 라우터


/* GET users listing. */
router.get('/users', renderUsers);
router.post('/register', rendCreatUser);

router.get('/main/:userid', renderuserid);

module.exports = router;
