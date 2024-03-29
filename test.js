// require("dotenv").config();
// const { MongoClient } = require("mongodb");
// const { createDB, readDB, updateDB, deleteDB } = require("./db");

// const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/`;
// console.log(uri);
// // 유저를 생성하는 코드
// const createUser = async (username, password, major, semester, m_list, s_list, eng) => {
//     const { MongoClient } = require("mongodb");

//     const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/`;

//     const userDataClient = new MongoClient(uri);
//   /**
//    * 사용자가 필요한 데이터들
//    * username : 유저이름 [string]
//    * password : 패스워드 []
//    * major : 전공 (컴퓨터공학, 컴퓨터공학(야)) [string]
//    * semester : 학기 [array]
//    * score : 현재 취득학점 [int]
//    * m_score : 전공학점 [int]
//    * m_list : 전공필수 리스트 [array]
//    * s_score : 교양학점 [int]
//    * s_list : 교양필수 리스트 [array]
//    * eng : 영어 졸업 인증 [bool]
//    * check : 신청여부 [bool]
//    */
//   try {
//     await userDataClient.connect();
//     // 사용자 데이터 베이스 및 컬렉션 가져오기
//     const userdb = userDataClient.db("userData").collection("users");
//     // 사용자 데이터 삽입
//     const newUser = {
//       username = "testuser",
//       password = "testpass",
//       major,
//       semester: [],
//       score: 0,
//       m_score: 0,
//       m_list: [],
//       s_score: 0,
//       s_list: [],
//       eng: false,
//       check: false,
//     };
//     const result = await userdb.insertOne(newUser);
//     return result.insertedId;
//   } catch (err) {
//     throw new Error(err);
//   } finally {
//     await userDataClient.close();
//   }
// };
// createUser();

// // 콘솔로 전체 유저를 확인하는 코드
// const printAllUsers = async () => {
//   try {
//     await userDataClient.connect();
//     const userdb = userDataClient.db("userData").collection("users");
//     const cursor = await userdb.find().toArray();

//     console.log(cursor);
//   } catch (err) {
//     throw new Error(err);
//   } finally {
//     await userDataClient.close();
//   }
// };

// printAllUsers();

// const newUser = {
//     username : "testuser",
//     password : "testpass",
//     major : null,
//     semester: [],
//     score: 0,
//     m_score: 0,
//     m_list: [],
//     s_score: 0,
//     s_list: [],
//     eng: false,
//     check: false,
//   };
// const createDB = async (newUser) => {
//     const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`;
//     const dbName = "userData";
//     const collectionName = "users";
//     const client = new MongoClient(uri);

//     try {
//     await client.connect();

//     const create = client.db(dbName).collection(collectionName);

//     const newUserData = newUser;
//     const result = await create.insertOne(newUserData);

//     console.log(`user creat: ${result.username} ID: ${result.insertedId}`);
//     return result.insertedId;
//     } catch (err) {
//     throw new Error(err);
//     } finally {
//     await client.close();
//     }
// }
// createDB(newUser);

// const allSemester =  async(req, res, next) => {
//     /**
//      * dbName은 timeTabel
//      * collectionName은 2019_1 ~ 2023_2
//      */
//     let dbName = "timeTable";
//     let collectionName = "2019_1";

//     try {
//         let allsemester = await readDB(dbName, collectionName);
//         console.log(allsemester);
//     } catch(err) {
//         throw new Error(err);
//     }
// }
// allSemester();

// const { readDB, updateDB } = require("./controller/db");

// const userList = async(req, res, next) => {
//     /**
//      * 유저의 전공 필수 리스트, 교양 필수 리스트 업데이트
//      */
//     let conditionName = { userid : "테스트유저1" };
//     let sectionSort = "s_list"; // 리스트 이름에 따라 전공, 교양 구분
//     let list = ['테스트1','테스트2', '테스트3']; // 리스트로 받음

//     try {
//         let user = await readDB("userData", "users", conditionName, false);
//         if (!user) {
//             return res.status(404).json({ message : '유저를 찾을 수 없음' });
//         } else {
//             if (sectionSort === "m_list") {
//                 await updateDB("userData", "users", conditionName, {m_list : list});
//             }
//             else if (sectionSort === "s_list") {
//                 await updateDB("userData", "users", conditionName, {s_list : list});
//             }
//             else {
//                 throw new Error(err);
//             }
//         }
//     } catch(err) {
//         throw new Error(err);
//     }
// }
// userList();

// userScore = async(req, res, next) => {
//     /**
//      * coditionName은 유저아이디
//      * 전체 학점, 전공 학점, 교양 학점을 업데이트 함
//      */
//     let conditionName = "테스트유저1";
//     let m_score = 3;
//     let s_score = 2;
//     let score = m_score + s_score;

//     try {
//         let user = await readDB("userData", "users", {userid : conditionName}, false);
//         if (!user) {
//             return res.status(404).json({ message : '유저를 찾을 수 없음' });
//         } else {
//             await updateDB("userData", "users", {userid : conditionName}, {m_score : user.m_score + m_score});
//             await updateDB("userData", "users", {userid : conditionName}, {s_score : user.s_score + s_score});
//             await updateDB("userData", "users", {userid : conditionName}, {score : user.score + score});
//         }
//     } catch(err) {
//         throw new Error(err);
//     }
// }
// userScore();

/**
 * criteria > score에 졸업 요건 담기 (교양필수 카테고리 리스트, 전공필수, 필요학점, 필요 전공 학점, 필요 교양 학점, 
시험 종류에 따른 점수(array))
 */
// const requirement = async() => {
//     const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/`;
//     const dbName = "criteria";
//     const collectionName = "score";
//     const client = new MongoClient(uri);
//     const requirement = {
//         score: 140,
//         s_score: 30,
//         s_list: {
//             "기초교양": ["Academic English", "글쓰기이론과실제", "대학영어회화1", "대학영어회화2", "대학수학(1)", "대학수학(2)"],
//             "교양필수": ["INU핵심글로벌", "INU핵심리더십", "INU핵심문제해결", "INU핵심창의융합", "INU핵심의사소통"],
//         },
//         m_score: 72,
//         m_need_score: 19,
//         m_list: ["자료구조", "Java언어", "C++언어", "알고리즘", "컴퓨터네트워크", "컴퓨터구조", "데이터베이스", "운영체제", "캡스톤디자인(1)", "캡스톤디자인(2)"],
//         engDay : {
//             "TOECIT": ["700"],
//             "TOEFL(IBT)": ["82"],
//             "NEW TEPS": ["264"],
//             "IELTS": ["6.5"],
//             "TOEIC SPEAKING": ["130"],
//             "TOEIC WRITING": ["140"],
// //             "OPIC": ["IM", "IH", "AL"],
// //         },
// //         engNight : {
// //             "TOECIT": ["600"],
// //             "TOEFL(IBT)": ["68"],
// //             "NEW TEPS": ["227"],
// //             "IELTS": ["5.5"],
// //             "TOEIC SPEAKING": ["110"],
// //             "TOEIC WRITING": ["120"],
// //             "OPIC": ["IL", "IM", "IH", "AL"],
// //         }
// //       };
// //     try {
// //         const create = client.db(dbName).collection(collectionName);
// //         await create.insertOne(requirement);
// //     } catch (err) {
// //         throw new Error(err);
// //     } finally {
// //         await client.close();
// //     }
// // }
// // requirement();

// // const requirement = {
// //     score: 140,
// //     s_score: 30,
// //     s_list: {
// //         "기초교양": ["Academic English", "글쓰기이론과실제", "대학영어회화1", "대학영어회화2", "대학수학(1)", "대학수학(2)"],
// //         "교양필수": ["INU핵심글로벌", "INU핵심리더십", "INU핵심문제해결", "INU핵심창의융합", "INU핵심의사소통"],
// //     },
// //     m_score: 72,
// //     m_need_score: 19,
// //     m_list: ["자료구조", "Java언어", "C++언어", "알고리즘", "컴퓨터네트워크", "컴퓨터구조", "데이터베이스", "운영체제", "캡스톤디자인(1)", "캡스톤디자인(2)"],
// //     engDay : {
// //         "TOECIT": ["700"],
// //         "TOEFL(IBT)": ["82"],
// //         "NEW TEPS": ["264"],
// //         "IELTS": ["6.5"],
// //         "TOEIC SPEAKING": ["130"],
// //         "TOEIC WRITING": ["140"],
// //         "OPIC": ["IM", "IH", "AL"],
// //     },
// //     engNight : {
// //         "TOECIT": ["600"],
// //         "TOEFL(IBT)": ["68"],
// //         "NEW TEPS": ["227"],
// //         "IELTS": ["5.5"],
// //         "TOEIC SPEAKING": ["110"],
// //         "TOEIC WRITING": ["120"],
// //         "OPIC": ["IL", "IM", "IH", "AL"],
// //     }
// //     };

// const { createDB, updateDB, deleteDB, readDB } = require("./controller/db");
// const { checkScore } = require("./controller/check");

// const updateUserMinor = async (req, res, next) => {
//   let updateMinorList1 = [
//     { sub_name: "대학영어회화1", credit: 3 },
//     { sub_name: "대학영어회화2", credit: 2 },
//   ]; // {"기초교양" : 이렇게 받고}
//   let updateMinorList2 = [{c_area :"INU핵심글로벌", credit : 3}]; // {"교양필수" : 이렇게 받고}
//   // 데이터 받는 코드

//   let sFoundamentalList = []; // 기초 교양리스트
//   let sNeedList = []; // 교양필수 리스트
  
//   let conditionName = { userid: "testuser1" };
//   // condition
//   try {
//     const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
    
//     let allFoundamentalList = data.s_list["기초교양"]; // 졸업요건 기초교양
//     let allNeedList = data.s_list["교양필수"]; // 졸업요건 교양필수

//     let allFoundamentalListN = data.s_list["기초교양"]; // 졸업요건 기초교양
//     let allNeedListN = data.s_list["교양필수"]; // 졸업요건 교양필수
//     let s_score = 0;

//     for (let list of updateMinorList1) {
//       if (!sFoundamentalList.includes(list.sub_name)) {
//         sFoundamentalList.push(list.sub_name);
//         allFoundamentalList.splice(allFoundamentalList.indexOf(list.sub_name), 1);
//         s_score += list.credit;
//       }

//     }
//     await updateDB("userData", "users", conditionName, {
//       "s_list.sFoundamentalList": sFoundamentalList,
//     });

//     // }
//     // 필수 관련
//     // 데이터 받아서 > c_area에 중복 안되게 넣고 s_score에 값 추가
//     for (let list of updateMinorList2) {
//         if(!sNeedList.includes(list.c_area)) {
//             sNeedList.push(list.c_area);
//             allNeedList.splice(allNeedList.indexOf(list.c_area), 1);
//            s_core += list.credit;
//         }
//     }
//     await updateDB("userData", "users", conditionName, {
//         "s_list.sNeedList": sNeedList,
//       });

//     const check = checkScore("s_core", s_score);
//       // 졸업 요건 
//     if (check && (sFoundamentalList.length === 6 && sNeedList.length === 3)) {
//         await updateDB("userData", "users", conditionName, { s_check: true });

//         const report = {};
//         report["state"] = true;
//         report["checkState"] = true; // 학점을 다 들었는가?
//         report["sFoundamentalList"] = true; // 기초교양 다 들었는지
//         report["sNeedList"] = true; // 교양 필수 다들었는지
//         report["s_score"] = s_score; // 현재 교양학점 학점
//         report["s_fundamental_list"] = allFoundamentalList // 부족한 기초교양리스트
//         report["s_need_list"] = allNeedList; // 부족한 교양필수리스트
//         res.json(report);
//     } else {
//         await updateDB("userData", "users", conditionName, { s_check: false });

//         const reprot = {};
//         report["state"] = false;
//         report["checkState"] = false; // 학점을 다 들었는가?
//         report["sFoundamentalList"] = false; // 기초교양 다 들었는지
//         report["sNeedList"] = false; // 교양 필수 다들었는지
//         report["s_score"] = s_score; // 현재 교양학점 학점
//         report["s_fundamental_list"] = allFoundamentalList // 부족한 기초교양리스트
//         report["s_need_list"] = allNeedList; // 부족한 교양필수리스트
//         // 유저기초교양과 졸업요건의 기초교양을 비교
//         if (allFoundamentalListN === sFoundamentalList) {
//             report["sFoundamentalList"] = true; // 기초교양 다 들었는지
//         }
//         // 유저교양필수와 졸업요건의 교양필수를 비교
//         if (allNeedListN === sNeedList) {
//             report["sNeedList"] = true;
//         }
//         if (check) {
//             report["checkState"] = true;
//         }
//         res.json(report);
//     }
    
//   } catch (err) {
//     throw new Error(err);
//   }
// };
// updateUserMinor();


// const createUser = async (req, res, next) => {
//   /**
//    * 사용자가 필요한 데이터들
//    * userid : 유저이름 [string]
//    * password : 패스워드 []
//    * major : 전공 (컴퓨터공학, 컴퓨터공학(야)) [string]
//    * semester : 학기 [array]
//    * score : 현재 취득학점 [int]
//    * m_score : 전공학점 [int]
//    * m_list : 전공필수 리스트 [array]
//    * m_need_score : 전공필수학점 [int]
//    * m_check : 전공 졸업 요건 충족
//    * s_score : 교양학점 [int]
//    * s_list : 교양 리스트 {기초교양:[],교양필수:[]}
//    * s_check : 교양 졸업 요건 충족
//    * eng : 영어 졸업 인증 [bool]
//    * engcheck : 신청여부 [bool]
//    * certificate : 졸업 자격 기준 [bool]
//    */

//   const { createDB, readDB } = require("./controller/db");
//   try {
//     const newUser = {
//       userid: "testuser1",
//       major: "testuser1",
//       email: "testuser1",
//       semester: "testuser1",
//       score: 0,
//       m_score: 0,
//       m_list: [],
//       m_need_score: 0,
//       m_check: false,
//       s_score: 0,
//       s_list: { sNeedList: [], sFoundamentalList: [] },
//       s_check: false,
//       eng: false,
//       engcheck: false,
//       certificate: false,
//     };
//     await createDB(newUser);
//   } catch (err) {
//     next(err);
//   }
// };

// const readMinor = async (req, res, next) => {
//     /**
//      * dbName = timeTable
//      * collectionName = "2019_1 ~ 2023_2"
//      * conditionName = {c_area : { "$regex": /INU|기초교양/i}}
//      * conditionName = { c_area : /INU/i }
//      */
//     let collectionName = "2019_1";

//     try {
//         const readM = await readDB("timeTable", collectionName, { "c_area": { "$regex": /INU|기초교양/i } });
//         console.log(readM);

//     } catch (err) {
//         throw new Error(err);
//     }
// };

// readMinor();

/**
 * 이승현 테스트 코드
 */
// const dotenv = require("dotenv");
// dotenv.config();

// const {createDB,updateDB,deleteDB, readDB} = require('./controller/db');

// const data = readDB("userData","users",{username : "testuser"})

// console.log(typeof data)

// const bcrypt = require("bcrypt");

// const salt = 12,
//   text = "abcd",
//   fail = "sbda";
// let hash;
// const start = async ()=>{
// await bcrypt.hash(text, salt, function (err, h) {
//   console.log("hashing", h);
//   hash = h;
//   console.log("complete", hash);
// });
// }
// const process = async ()=>{
// await bcrypt.compare(fail, hash, function (err, result) {
//   console.log("fail", result);
// });
// await bcrypt.compare(text, hash, function (err, result) {
//   console.log("success", result);
// })};
// start();
// process();

// const updateUserMajor = async (req, res, next) => {
//   const reqbodyneed = [{sub_name:"캡스톤디자인(1)",credit:2}, {sub_name:"캡스톤디자인(2)",credit:2}];
//   const reqbodychoice = [];
//   const needList = [];
//   const choiceList = [];
//   let m_score = 0;
//   let m_need_score = 0;
//   let conditionName = { userid: "test" };
//   try {
//     const data = await readDB("criteria", "score", { name: "졸업요건" }, false);
//     // 졸업요건 배열이랑 클라이언트에서 받은 전공필수 배열이랑 비교해서 없으면 유저리스트에 추가
//     reqbodyneed.forEach((value) => {
//       if (!needList.includes(value.sub_name)) {
//         needList.push(value.sub_name);
//         data.m_list.splice(data.m_list.indexOf(value.sub_name), 1);
//         m_score += value.credit;
//         m_need_score += value.credit;
//       }
//     });
//     await updateDB("userData", "users", conditionName, {
//       m_need_score: m_need_score,
//     });
//     await updateDB("userData", "users", conditionName, {
//       m_list: needList,
//     });
//     reqbodychoice.forEach((value) => {
//       if (!choiceList.includes(value.sub_name)) {
//         choiceList.push(value.sub_name);
//         m_score += value.credit;
//       }
//     });
//     const m_need_check = checkScore("m_need_score", m_need_score);
//     const check = checkScore("m_score", m_score);
//     // 필수리스트가 캡디1 캡디2포함하고 length 7이상이면 통과
//     if (
//       reqbodyneed.includes("캡스톤디자인 (1)") &
//       reqbodyneed.includes("캡스톤디자인 (2)") &
//       m_need_check &
//       check
//     ) {
//       const report = {};
//       report["state"] = true;
//       report["checkState"] = true; // 학점을 다 들었는가?
//       report["m_need_checkState"] = true; // 필수 과목을 조건에 맞게 다 들었는가?
//       report["capstoneState"] = true; // 캡스톤 디자인 1 2 를 들었는가?
//       report["m_score"] = m_score; // 현재 전공 학점
//       report["m_need_score"] = m_need_score; // 현재 필수 과목 학점
//       report["m_need_list"] = data.m_list; // 남은 필수 과목
//       await updateDB("userData", "users", conditionName, { m_check: true });
//       res.json(report);
//     } else {
//       await updateDB("userData", "users", conditionName, { m_check: false });
//       const report = {};
//       report["state"] = false;
//       report["checkState"] = true; // 학점을 다 들었는가?
//       report["m_need_checkState"] = true; // 필수 과목을 조건에 맞게 다 들었는가?
//       report["capstoneState"] = true; // 캡스톤 디자인 1 2 를 들었는가?
//       report["m_score"]= m_score; // 현재 전공 학점
//       report["m_need_score"]=m_need_score; // 현재 필수 과목 학점
//       report["m_need_list"]=data.m_list; // 남은 필수 과목
//       if (
//         !(
//           reqbodyneed.includes("캡스톤디자인 (1)") &
//           reqbodyneed.includes("캡스톤디자인 (2)")
//         )
//       ) {
//         report["capstoneState"] = false;
//       }
//       if (!m_need_check) {
//         report["m_need_checkState"] = false;
//       }
//       if (!check) {
//         report["checkState"] = false;
//       }
//       res.json(report);
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// const dotenv = require('dotenv');
// dotenv.config();

// (emailForSignUp = () => {
//   const receiverEmail = "robot9917@naver.com";
//   const nodemailer = require("nodemailer");
//   const { v4: uuidv4 } = require("uuid");
//   const secretCode = uuidv4();
//   console.log(secretCode);
//   const {
//     OAUTH_USER,
//     OAUTH_CLIENT_ID,
//     OAUTH_CLIENT_SECRET,
//     OAUTH_REFRESH_TOKEN,
//   } = process.env;
//   async function main(receiverEmail) {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.google.com",
//       port: 587,
//       secure: true,
//       auth: {
//         type: "OAuth2",
//         user: `${OAUTH_USER}`,
//         clientId: `${OAUTH_CLIENT_ID}`,
//         clientSecret: `${OAUTH_CLIENT_SECRET}`,
//         refreshToken: `${OAUTH_REFRESH_TOKEN}`,
//       },
//     });
//     const message = {
//       from: OAUTH_USER,
//       to: receiverEmail,
//       subject: "letmegraduated 앱 회원 인증을 위한 이메일입니다.",
//       html: `
//       <h1>
//         아래의 코드를 앱에 입력해주세요.
//       </h1>
//       <hr />
//       <br />
//       <p>아래의 코드는 다른 사람에게 공유해서는 안되며 인증마다 다른 코드가 입력됩니다.<p/>
//       <p>코드는 다음과 같습니다. ${secretCode}</p>
//       <br />
//       <hr />
//       <p>이 메일은 letmegraduated app 회원 인증을 위해서 전송되었습니다.</p>
//       <p>이 메일을 요청한 적이 없으시다면 무시해 주세요.</p>
//     `,
//     };
//     await transporter.sendMail(message);
//   }
//   main(receiverEmail);
//   // next();
// })();

const capstone = async(reqbodyneed, checkCapstone) => {
    for (let item of reqbodyneed) {
        if (item.hasOwnProperty("sub_name") && item.sub_name == checkCapstone) {
            return true;
        }
    }
    return false;
}

const data = {
    "list": [
      {
        "_id": "65a6972665d1145955e6d8e3",
        "major": "컴퓨터공학부",
        "grade": 1,
        "c_major": "전공기초",
        "c_area": "전공기초",
        "sub_name": "컴퓨터공학개론",
        "credit": 2
      },
      {
        "_id": "65a6972665d1145955e6d8ec",
        "major": "컴퓨터공학부",
        "grade": 2,
        "c_major": "전공필수",
        "c_area": "전공필수",
        "sub_name": "캡스톤디자인(1)",
        "credit": 3
      }
    ]
  };

console.log(capstone(data.list, "캡스톤디자인(1)"));
console.log(capstone(data.list, "캡스톤디자인(2)"));
console.log(capstone(data.list, "캡스톤디자인(2)"));

