const express = require("express");
const router = express.Router();
const {
  updataUserExam,
  readMinor,
  readMajor,
  takeSemester,
  updateUserMinor,
} = require("../controller/index");
const { isLoggedIn } = require("../controller/auth");

//main
// 유저 데이터 중 취득 학점, 전공필수, 전공 학점, 교양 학점, 자격기준 조건을 가져옴.
router.get("/main", isLoggedIn);

// 영어 졸업인증 요건 true/false로 업데이트
router.put("/main", isLoggedIn, updataUserExam);

// major
// 유저가 들은 수강학기
router.get("/major/semester", isLoggedIn, takeSemester);

// 선택된 수강학기의 모든 전공 과목 리스트를 꺼내온다.
router.post("/major/semester", isLoggedIn, readMajor);

// 유저데이터 변경하고 미수강한 전필 과목, 남은 전공 학점 출력
router.put("/major", isLoggedIn);

//minor
// 유저가 들은 수강학기
router.get("/minor/semester", isLoggedIn, takeSemester);

// 선택된 수강학기의 모든 교양 과목 리스트를 꺼내온다.
router.post("/minor/semester", isLoggedIn, readMinor);

// 기초교양, 교양필수리스트, 교양 학점, 총학점 업데이트
router.put("/minor", isLoggedIn, updateUserMinor);

module.exports = router;
