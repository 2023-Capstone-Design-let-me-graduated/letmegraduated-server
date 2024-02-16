const express = require('express');
const router = express.Router();
const { pullExamCriteria, updateEng } = require('../controller/user');
const { isLoggedIn } = require("../controller/auth");

// 유저가 주간, 야간에 따라 시험 종류에 따른 제한 조건 출력
router.post('/exam', isLoggedIn, pullExamCriteria);

// 유저가 졸업이 가능한지 확인하는 여부 true/false로 업데이트
router.put('/exam',isLoggedIn, updateEng);

module.exports = router;