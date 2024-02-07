const dotenv = require("dotenv");
dotenv.config();
const { MongoClient } = require("mongodb");
// // Replace the uri string with your connection string.

// const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`;

// createDB, readDB, updateDB, deleteDB 함수

// const client1 = new MongoClient(uri); // 클라이언트는 내가 조종할 수 있는 db 개수 늘림.
// const client2 = new MongoClient(uri);

// async function run() {
//   try {
//     const database = client1.db("userData");
//     const movies = database.collection("users");
//     const database2 = client2.db("timeTable");
//     const movies2 = database2.collection("2019_1");
//     const l = [[], [], [], []];

//     const subjects = movies2.find();
//     for await (const subject of subjects) {
//       l[0].push(subject);
//       console.log(subject);
//     }
//     const movie = await movies.insertOne({ name: "firstuser", article: l });

//     console.log(movie);
//   } finally {
//     await client1.close();
//     await client2.close();
//   }
// }
// run().catch(console.dir);

const userDataClient = new MongoClient(uri);

// 전체적으로 쓸 수 있는 db에 접근하는 코드 c r u d 를 만들자.

// 유저를 생성하는 코드
const createUser = async(username, password, major, semester, m_list, s_list, eng) => {
  /**
   * 사용자가 필요한 데이터들
   * username : 유저이름 [string]
   * password : 패스워드 []
   * major : 전공 (컴퓨터공학, 컴퓨터공학(야)) [string]
   * semester : 학기 [array]
   * score : 현재 취득학점 [int]
   * m_score : 전공학점 [int]
   * m_list : 전공필수 리스트 [array]
   * s_score : 교양학점 [int]
   * s_list : 교양필수 리스트 [array]
   * eng : 영어 졸업 인증 [bool]
   * check : 신청여부 [bool]
   */
  try {
    await userDataClient.connect();
    // 사용자 데이터 베이스 및 컬렉션 가져오기
    const userdb = userDataClient.db("userData").collection("users");
    // 사용자 데이터 삽입
    const newUser = {
      username,
      password,
      major,
      semester : [],
      score : 0,
      m_score : 0,
      m_list : [],
      s_score : 0,
      s_list : [],
      eng : false,
    };
    const result = await userdb.insertOne(newUser);
    return result.insertedId;
  } catch (err) {
    throw new Error(err);
  } finally {
    await userDataClient.close();
  }
}

// 콘솔로 전체 유저를 확인하는 코드
const printAllUsers = async() => {
  try {
    await userDataClient.connect();
    const userdb = userDataClient.db("userData").collection("users");
    const cursor = userdb.find();
    
    for await(const doc of cursor) {
      console.log(doc);
    }
  } catch (err) {
    throw new Error(err);
  } finally {
    await userDataClient.close();
  }
}
printAllUsers();
// 콘솔로 일부분 유저를 확인하는 코드

module.exports={createUser, printAllUsers};