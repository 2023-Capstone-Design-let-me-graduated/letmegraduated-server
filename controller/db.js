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

// 회원 가입 시 유저 컬렉션에 도큐먼트 생성하는 코드
const createDB = async(newUser) => {
    const dbName = "userData";
    const collectionName = "users";
    const client = new MongoClient(uri);
    
    try {
      await client.connect();

      const create = client.db(dbName).collection(collectionName);

      const newUserData = newUser;
      const result = await create.insertOne(newUserData);

      // console.log(`user creat: ${result.username} ID: ${result.insertedId}`);
      return result.insertedId;
    } catch (err) {
      throw new Error(err);
    } finally {
      await client.close();
    }
}

// 유저 데이터, 타임테이블(전공, 교양), exam(영어시험)을 가져오는 DB
const readDB = async(req, res, next) => {
  const dbName = req.body.dbName; // 클라이언트에서 db이름을 가져온다.
  const client = new MongoClient(uri);

  try {
    await client.connect();

    
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}

module.exports={createDB, readDB, };