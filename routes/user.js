const express = require('express');
const router = express.Router();
const { checkEng } = require('../controller/user');
const { isLoggedIn } = require("../controller/auth");

// 유저가 주간, 야간에 따라 시험 종류에 따른 제한 조건꺼내서 되는지 안되는지 판별 되면 > 업데이트
router.post('/exam', isLoggedIn, checkEng);

module.exports = router;