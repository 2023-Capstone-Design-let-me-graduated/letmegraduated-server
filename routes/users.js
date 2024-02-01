// users 라우터
const express = require('express');
const router = express.Router();
const { renderUsers } = require('../controller/users');

/* GET users listing. */
router.get('/users', renderUsers);

// module.exports = router;