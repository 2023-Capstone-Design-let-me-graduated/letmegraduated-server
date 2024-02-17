require("dotenv").config();
const { MongoClient } = require("mongodb");

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
//             "OPIC": ["IM", "IH", "AL"],
//         },
//         engNight : {
//             "TOECIT": ["600"],
//             "TOEFL(IBT)": ["68"],
//             "NEW TEPS": ["227"],
//             "IELTS": ["5.5"],
//             "TOEIC SPEAKING": ["110"],
//             "TOEIC WRITING": ["120"],
//             "OPIC": ["IL", "IM", "IH", "AL"],
//         }
//       };
//     try {
//         const create = client.db(dbName).collection(collectionName);
//         await create.insertOne(requirement);
//     } catch (err) {
//         throw new Error(err);
//     } finally {
//         await client.close();
//     }
// }
// requirement();

// const requirement = {
//     score: 140,
//     s_score: 30,
//     s_list: {
//         "기초교양": ["Academic English", "글쓰기이론과실제", "대학영어회화1", "대학영어회화2", "대학수학(1)", "대학수학(2)"],
//         "교양필수": ["INU핵심글로벌", "INU핵심리더십", "INU핵심문제해결", "INU핵심창의융합", "INU핵심의사소통"],
//     },
//     m_score: 72,
//     m_need_score: 19,
//     m_list: ["자료구조", "Java언어", "C++언어", "알고리즘", "컴퓨터네트워크", "컴퓨터구조", "데이터베이스", "운영체제", "캡스톤디자인(1)", "캡스톤디자인(2)"],
//     engDay : {
//         "TOECIT": ["700"],
//         "TOEFL(IBT)": ["82"],
//         "NEW TEPS": ["264"],
//         "IELTS": ["6.5"],
//         "TOEIC SPEAKING": ["130"],
//         "TOEIC WRITING": ["140"],
//         "OPIC": ["IM", "IH", "AL"],
//     },
//     engNight : {
//         "TOECIT": ["600"],
//         "TOEFL(IBT)": ["68"],
//         "NEW TEPS": ["227"],
//         "IELTS": ["5.5"],
//         "TOEIC SPEAKING": ["110"],
//         "TOEIC WRITING": ["120"],
//         "OPIC": ["IL", "IM", "IH", "AL"],
//     }
//     };

 const {createDB,updateDB,deleteDB, readDB} = require('./controller/db');

const updateUserMinor = async(req, res, next) => {
    let updateMinorList1 = [{"sub_name" : "대학영어회화1"}, {"sub_name" : "대학영어회화2"}]; // {"기초교양" : 이렇게 받고}
    let updateMinorList2 = ["INU핵심글로벌"]; // {"교양필수" : 이렇게 받고}
    let emptyList = [];
    let conditionName = { userid : "testuser1"};
    try {
    const user = await readDB("userData", "users", conditionName, false);
      const data = await readDB("criteria", "score", { name : "졸업요건" }, false);
      // 졸업요건 배열이랑 클라이언트에서 받은 기초교양 배열이랑 비교해서 없으면 유저리스트에 추가

      for (let list of updateMinorList1) {
        emptyList.push(list.sub_name);
      }
      console.log(emptyList);
      await updateDB("userData", "users", conditionName,  {"s_list.sFoundamentalList": emptyList });
      
      const check = checkScore("s_core", user.s_score);
    await updateDB("userData", "users", conditionName, { s_check : check });
    } catch(err) {
        throw new Error(err);
    }
  }
  updateUserMinor();

const createUser = async (req, res, next) => {
    /**
     * 사용자가 필요한 데이터들
     * userid : 유저이름 [string]
     * password : 패스워드 []
     * major : 전공 (컴퓨터공학, 컴퓨터공학(야)) [string]
     * semester : 학기 [array]
     * score : 현재 취득학점 [int]
     * m_score : 전공학점 [int]
     * m_list : 전공필수 리스트 [array]
     * m_need_score : 전공필수학점 [int]
     * m_check : 전공 졸업 요건 충족
     * s_score : 교양학점 [int]
     * s_list : 교양 리스트 {기초교양:[],교양필수:[]}
     * s_check : 교양 졸업 요건 충족
     * eng : 영어 졸업 인증 [bool]
     * engcheck : 신청여부 [bool]
     * certificate : 졸업 자격 기준 [bool]
     */
    
    const { createDB, readDB } = require("./controller/db");
    try {
    
      const newUser = {
        userid: "testuser1",
        major: "testuser1",
        email: "testuser1",
        semester: "testuser1",
        score: 0,
        m_score: 0,
        m_list: [],
        m_need_score: 0,
        m_check: false,
        s_score: 0,
        s_list: { sNeedList: [], sFoundamentalList: [] },
        s_check: false,
        eng: false,
        engcheck: false,
        certificate: false,
      };
      await createDB(newUser);
    } catch (err) {
      next(err);
    }
  };

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