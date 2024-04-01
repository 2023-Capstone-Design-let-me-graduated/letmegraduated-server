require("dotenv").config();
const { MongoClient } = require("mongodb");
const { createDB, readDB, updateDB, deleteDB } = require("./controller/db");

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

const checkScore = async (type, score) => {
  const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
  const criteria = data[type];
  console.log(criteria);
  return criteria <= score;
};

const runCheck = async () => {
  const ch = await checkScore("m_score", 20);
  console.log(ch);
}
runCheck();
