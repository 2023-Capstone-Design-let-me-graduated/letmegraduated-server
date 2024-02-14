const express = require('express');
const router = express.Router();
const { readUserPull, updataUserExam, readAllSemester, 
        updataUserScore, updataUserList, userEngCheck,readMinor,
        readMajor } = require('../controller/index');
const { isNotLoggedIn, isLoggedIn } = require("../controller/auth");

// 유저 데이터를 클라이언트에 보냄
router.get('/main/:userid', isLoggedIn, readUserPull);

// 유저의 영어 졸업 인증 요건을 업데이트
router.put('/main/:userid', isLoggedIn, updataUserExam);

// timetable에 있는 전체 시간표를 클라이언트에 보냄
router.get('/main/:userid/semester', isLoggedIn, readAllSemester);

// 유저의 전체학점, 전공학점, 교양학점을 업데이트
router.put('/main/:userid/score', isLoggedIn, updataUserScore);

// 유저의 전공 필수 리스트, 교양 필수 리스트 업데이트
router.put('/main/:userid/list', isLoggedIn, updataUserList);

// 유저가 영어 졸업인증 신청을 했는 확인 업데이트
router.put('/main/:userid/check', isLoggedIn, userEngCheck);

// major
// timetable에서 전공필수, 전공선택만 가져옴
router.get('/major/semester', isLoggedIn, readMajor);

// timetable에서 교양필수을 가져옴
router.get('/minor/semester', isLoggedIn, readMinor);

module.exports = router;