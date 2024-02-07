// 몽고디비랑 연결해서 user데이터 뽑아봤음.
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

// // Replace the uri string with your connection string.
const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`

const userDataClient = new MongoClient(uri);
let testUser = {
  username : "testUser",
  password : "testPass",
  major : "컴퓨터공학",
  semester : ['2019_1', '2019_2', '2020_1', '2020_2'],
  score : 0,
  m_score: 0,
  m_list: ['C++언어', '컴퓨터구조', '알고리즘'],
  s_score: 0,
  s_list: ['대학수학(2)', '프랑스어1'],
  eng : false,
};

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
    console.log(`유저 ${username} 생성 ID: ${result.insertedId}`);
    return result.insertedId;
  } catch (err) {
    console.error(err);
  } finally {
    await userDataClient.close();
  }
}
// createUser();

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
    console.error(err);
  } finally {
    await userDataClient.close();
  }
}
printAllUsers();

// 콘솔로 일부분 유저를 확인하는 코드


module.exports={createUser, printAllUsers, };