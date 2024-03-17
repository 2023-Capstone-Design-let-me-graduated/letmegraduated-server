// controller
const { readDB, updateDB } = require("./db");

// 유저가 주간, 야간에 따라 시험 종류에 따른 제한 조건 출력
exports.checkEng = async (req, res, next) => {
  const major = req.user.major,
    testType = req.body.testType,
    score = req.body.score;
  let exam,
    check = false;
  try {
    if (major === "컴퓨터공학부 주간") {
      exam = await readDB(
        "criteria",
        "exam",
        {
          type: "주간",
          name: testType,
        },
        false
      );
    } else {
      exam = await readDB(
        "criteria",
        "exam",
        {
          type: "야간",
          name: testType,
        },
        false
      );
    }
    // exam = 해당 시험의 조건
    if (exam.name == "OPIC") {
      exam.condition.forEach((value, index, array) => {
        if (value == score) {
          check = true;
        }
      });
    } else {
      if (+exam.condition[0] <= +score) {
        check = true;
      }
    }
    // 업데이트
    updateDB("userData", "users", { userid: req.user.userid }, { eng: check });
    res.json({ check: check, condition: exam.condition });
  } catch (err) {
    throw new Error(err);
  }
};