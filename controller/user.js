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
    if (major === "컴퓨터공학") {
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
      if (+exam.condition[0] > +score) {
        check = true;
      }
    }
    // 업데이트
    updateDB("userData", "users", { userid: req.user.userid }, { eng: check });
    res.json({check:check,condition:exam.condition});
  } catch (err) {
    throw new Error(err);
  }
};

// exports.updatecertificate = async (req, res, next) => {
//   /**
//    * dbName은 userData
//    * collectionName은 users
//    * conditionName은 { username : "이름" } 형식으로 받음
//    * 전체 score는 140학점
//    * 교양 s_score는 30학점 이상
//    * 전공 m_score는 72학점 이상
//    * 영어 졸업 인증 true
//    * s_list[] 교양필수 3개이상
//    * m_list[] 전공필수 7개이상
//    */

//   try {
//     const s_list = req.user.s_list.length; // 교양필수 배열 개수를 가져옴
//     // 교양 필수의 경우 카테고리를 기준으로 해야 됨
//     const m_list = user.m_list.length; // 전공필수 배열 개수를 가져옴
//     if (!user) {
//       return res.status(404).json({ message: "유저를 찾을 수 없음" });
//     } else {
//       if (
//         user.score >= 140 &&
//         user.m_score >= 72 &&
//         user.s_score >= 30 &&
//         user.eng &&
//         user.check
//       ) {
//         if (s_list >= 3 && m_list >= 7) {
//           await updateDB(dbName, collectionName, conditionName, {
//             certificate: true,
//           });
//         }
//       }
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// };
