require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createDB, readDB, updateDB, deleteDB } = require("./controller/db");

/**
 * list를 받아서 need,choice,fundamental로 나누는 함수
 * @param {array} list
 */
const divideList = async (list) => {
  // need, choice, fundamental로 분류할 객체 생성
  try {
    result = { need: [], choice: [], foundamental: [] };
    if (list[0].c_area.includes("전공")) {
      list.forEach((v) => {
        if (v.c_area.endsWith("핵심") || v.c_area.endsWith("필수")) {
          result.need.push(v);
        } else if (v.c_area.endsWith("심화") || v.c_area.endsWith("선택")) {
          result.choice.push(v);
        } else if (v.c_area.endsWith("기초")) {
          result.foundamental.push(v);
        }
      });
    } else if (
      list[0].c_area.includes("교양") ||
      list[0].c_major.includes("교양")
    ) {
      list.forEach((v) => {
        if (v.c_major == "기초교양" || v.c_area == "기초교양") {
          result.foundamental.push(v);
        } else {
          result.need.push(v);
        }
      });
    }
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// const checkDuplication = async (subjectList, dataObject) => {
//   return subjectList.some((v) => v.sub_name === dataObject.sub_name);
// };

// const readMinor = async (req, res, next) => {
//   const selectedSemester = "2023_1";
//   try {
//     // let minor = { need: {grade1: [], grade2: [], grade3: [], grade4: [], gradeAll: []}, 
//     //               foundamental: {grade1: [], grade2: [], grade3: [], grade4: [], gradeAll: []} };
//     let minor = {need: [], foundamental: []};
//     const data = await readDB("timeTable", selectedSemester, {
//       $or: [{ c_area: /교양/ }, { c_major: /교양/ }],
//     });
//     for (const v of data) {
//       // if (v.c_major.endsWith("교양") || v.c_area.endsWith("교양")) {
//       //   if (!((await checkDuplication(minor.need.grade1, v)) ||
//       //         (await checkDuplication(minor.need.grade2, v)) ||
//       //         (await checkDuplication(minor.need.grade3, v)) ||
//       //         (await checkDuplication(minor.need.grade4, v)) ||
//       //         (await checkDuplication(minor.need.gradeAll, v)))) {
//       //     switch (v.grade) {
//       //       case 1:
//       //         minor.need.grade1.push(v);
//       //         break;
//       //       case 2:
//       //         minor.need.grade2.push(v);
//       //         break;
//       //       case 3:
//       //         minor.need.grade3.push(v);
//       //         break;
//       //       case 4:
//       //         minor.need.grade4.push(v);
//       //         break;
//       //       default:
//       //         minor.need.gradeAll.push(v);
//       //         break;
//       //     }
//       //   }
//       // } else {
//       //   if (!((await checkDuplication(minor.foundamental.grade1, v)) ||
//       //         (await checkDuplication(minor.foundamental.grade2, v)) ||
//       //         (await checkDuplication(minor.foundamental.grade3, v)) ||
//       //         (await checkDuplication(minor.foundamental.grade4, v)) ||
//       //         (await checkDuplication(minor.foundamental.gradeAll, v)))) {
//       //     switch (v.grade) {
//       //       case 1:
//       //         minor.foundamental.grade1.push(v);
//       //         break;
//       //       case 2:
//       //         minor.foundamental.grade2.push(v);
//       //         break;
//       //       case 3:
//       //         minor.foundamental.grade3.push(v);
//       //         break;
//       //       case 4:
//       //         minor.foundamental.grade4.push(v);
//       //         break;
//       //       default:
//       //         minor.foundamental.gradeAll.push(v);
//       //         break;
//       //     }
//       //   }
//       // }
//       if (v.c_area.endsWith("기초교양") || v.c_area.endsWith("기초")) {
//         if (!(await checkDuplication(minor.foundamental, v))) {
//           minor.foundamental.push(v);
//         }
//       } else if (v.c_major.endsWith("필수교양") || v.c_major.endsWith("핵심교양")) {
//         if (!(await checkDuplication(minor.need, v))) {
//           minor.need.push(v);
//         }
//       }
//     }
//     const grade = (a, b) => {
//       const grades = [1, 2, 3, 4, '전학년'];
//       const gradeAIndex = grades.indexOf(a.grade);
//       const gradeBIndex = grades.indexOf(b.grade);
    
//       if (gradeAIndex !== -1 && gradeBIndex !== -1) {
//         return gradeAIndex - gradeBIndex;
//       }
    
//       if (gradeAIndex !== -1) {
//         return -1;
//       }

//       if (gradeBIndex !== -1) {
//         return 1;
//       }
      
//       return 0;
//     };
//     minor.need.sort(grade);
//     minor.foundamental.sort(grade);
//     console.log(minor);
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// readMinor();

// const checkScore = async (type, score) => {
//   const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
//   const criteria = data[type];
//   console.log(criteria);
//   return criteria <= score;
// };

// const runCheck = async () => {
//   const ch = await checkScore("m_score", 20);
//   console.log(ch);
// }
// runCheck();
// const data = {"list":[
//   {"_id":"65a6972665d1145955e6d8e3",
//   "major":"컴퓨터공학부",
//   "grade":1,
//   "c_major":"교양필수",
//   "c_area":"기초교양",
//   "sub_name":"대학수학(1)",
//   "credit":3},
//  {"_id":"65a6972665d1145955e6d8ec",
//   "major":"컴퓨터공학부",
//   "grade":1,
//   "c_major":"교양필수",
//   "c_area":"기초교양",
//   "sub_name":"대학수학(2)",
//   "credit":3},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"컴퓨터공학부",
//   "grade":1,
//   "c_major":"기초교양",
//   "c_area":"학문의기초",
//   "sub_name":"대학수학(2)",
//   "credit":3},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"교양",
//   "grade":1,
//   "c_major":"교양필수",
//   "c_area":"기초교양",
//   "sub_name":"Academic English",
//   "credit":2},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"교양",
//   "grade":1,
//   "c_major":"교양필수",
//   "c_area":"기초교양",
//   "sub_name":"글쓰기이론과실제",
//   "credit":2},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"교양",
//   "grade":2,
//   "c_major":"교양필수",
//   "c_area":"기초교양",
//   "sub_name":"대학영어회화1",
//   "credit":1},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"교양",
//   "grade":2,
//   "c_major":"교양필수",
//   "c_area":"기초교양",
//   "sub_name":"대학영어회화2",
//   "credit":1},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"교양",
//   "grade":"전학년",
//   "c_major":"교양필수",
//   "c_area":"INU핵심글로벌",
//   "sub_name":"아랍어1",
//   "credit":3},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"교양",
//   "grade":"전학년",
//   "c_major":"교양필수",
//   "c_area":"INU핵심의사소통",
//   "sub_name":"발표와토론",
//   "credit":3},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"교양",
//   "grade":"전학년",
//   "c_major":"교양필수",
//   "c_area":"INU핵심문제해결",
//   "sub_name":"논리로보는세상",
//   "credit":3},
//   {"_id":"65a6972665d1145955e6d8ec",
//   "major":"교양",
//   "grade":"전학년",
//   "c_major":"핵심교양",
//   "c_area":"(핵심)인문",
//   "sub_name":"미학의 이해",
//   "credit":3}], 
//   "sScore": 22};


// updateUserMinor(data);

/**
 * 숫자가 졸업 조건인 type과 자신의 숫자 score를 넣어서 졸업 조건에 충족했는지 확인하는 함수
 * @param {string} type
 * @param {number} score
 *  @returns {boolean}
 */
const checkScore = async (type, score) => {
  const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
  const criteria = data[type];
  console.log(criteria);
  return criteria <= score;
};

(async () => {
  const test = await checkScore("s_score", 33); // "s_score"를 전달합니다.
  console.log(test);
})();

