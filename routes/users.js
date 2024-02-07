// users 라우터
const express = require('express');
const router = express.Router();

const { renderUsers, rendCreatUser, renderuserid } = require('../controller/users');

/* GET users listing. */
router.get('/users', renderUsers);
router.post('/register', rendCreatUser);

router.get('/main/:userid', renderuserid);

module.exports = router;
