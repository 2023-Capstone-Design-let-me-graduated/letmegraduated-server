//require("dotenv").config();
//const { MongoClient } = require("mongodb");

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

// const readDB = async (dbName, collectionName) => {
//     const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`;
//     const client = new MongoClient(uri);
  
//     try {
//       await client.connect();
//       const timeTableCollectionName = [
//         "2019_1", "2019_2", "2020_1", "2020_2", "2021_1",
//         "2021_2", "2022_1", "2022_2", "2023_1", "2023_2",
//       ];
  
//       let data;
//       if (dbName === "userData") {
//         if (collectionName === "users") {
//             const database = client.db(dbName);
//             const coll = database.collection(collectionName);
//             data = await coll.find().toArray();
//             console.log(data);
//             return data;
//         }
//         else {
//             throw new Error(err);
//         }
//       }
//       else if (dbName === "timeTable") {
//         if (timeTableCollectionName.includes(collectionName)) {
//             const database = client.db(dbName); 
//             const coll = database.collection(collectionName);
//             data = await coll.find().toArray();
//             console.log(data);
//             return data;
//         }
//         else {
//             throw new Error(err);
//         }
//       }
//       else if (dbName === "criteria") {
//         if (collectionName === "exam") {
//             const database = client.db(dbName); 
//             const coll = database.collection(collectionName);
//             data = await coll.find().toArray();
//             console.log(data);
//             return data;
//         }
//         else {
//             throw new Error(err);
//         }
//       }
//       else {
//         throw new Error(err);
//       }
//     } catch (err) {
//       throw new Error(err);
//     } finally {
//       await client.close();
//     }
//   }
//   readDB("timeTable", "2019_1");


/**
 * 이승현 테스트 코드
 */
const dotenv = require("dotenv");
dotenv.config();

const {createDB,updateDB,deleteDB} = require('./controller/db');

deleteDB("userData","users",{username : "codefug"});