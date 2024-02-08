require("dotenv").config();
const { MongoClient } = require("mongodb");

// const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/`;
// const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`;

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





/**
 * createDB(); 함수
 * @param {object} newUser 
 * 회원 가입 시 유저 컬렉션에 도큐먼트 생성하는 코드
 */
const createDB = async (newUser) => {
  const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`;
  const dbName = "userData";
  const collectionName = "users";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const create = client.db(dbName).collection(collectionName);

    const newUserData = newUser;
    const result = await create.insertOne(newUserData);

    //console.log(`user creat: ${result.username} ID: ${result.insertedId}`);
    return result.insertedId;
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}


/**
 * readDB(); 함수
 * @param {string} dbName 
 * @param {string} collectionName
 * @return {object}
 * 유저 데이터, 타임테이블(전공, 교양), exam(영어시험)을 전체 콜렉션을 가져오는 DB
 */
const readDB = async (dbName, collectionName) => {
  const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const timeTableCollectionName = [
      "2019_1", "2019_2", "2020_1", "2020_2", "2021_1",
      "2021_2", "2022_1", "2022_2", "2023_1", "2023_2",
    ];

    let data;
    if (dbName === "userData") {
      if (collectionName === "users") {
          const database = client.db(dbName);
          const coll = database.collection(collectionName);
          data = await coll.find().toArray();
          console.log(data);
          return data;
      }
      else {
          throw new Error(err);
      }
    }
    else if (dbName === "timeTable") {
      if (timeTableCollectionName.includes(collectionName)) {
          const database = client.db(dbName); 
          const coll = database.collection(collectionName);
          data = await coll.find().toArray();
          console.log(data);
          return data;
      }
      else {
          throw new Error(err);
      }
    }
    else if (dbName === "criteria") {
      if (collectionName === "exam") {
          const database = client.db(dbName); 
          const coll = database.collection(collectionName);
          data = await coll.find().toArray();
          console.log(data);
          return data;
      }
      else {
          throw new Error(err);
      }
    }
    else {
      throw new Error(err);
    }
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}

/**
 * 
 * @param {string} dbName 
 * @param {string} collectionName 
 * @param {object} condition 
 * @param {object} change 
 * @returns {void}
 * dbName의 collectionName중에서
 * condition에 해당하는 document 하나를 골라서 change에 있는 것으로 바꾼다.
 */
const updateDB = async (dbName, collectionName, condition, change) => {
  const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/`;
  const client = new MongoClient(uri);
  const database = client.db(dbName);
  const coll = database.collection(collectionName);
  try {
    const result = await coll.updateOne(
      condition,
      { $set: change }, // Use $set to specify the fields to be updated
      // You can add optional options here if needed
    );
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
};

/**
 * 
 * @param {string} dbName 
 * @param {string} collectionName 
 * @param {object} condition 
 * @returns {void}
 * dbName의 collectionName중에서
 * condition에 해당하는 document 하나를 골라서 삭제.
 */
const deleteDB = async (dbName, collectionName, condition) => {
  const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/`;
  const client = new MongoClient(uri);
  console.log(uri);
  const database = client.db(dbName);
  const coll = database.collection(collectionName);
  try {
    const result = await coll.deleteOne(condition);
    console.log(result.deletedCount);
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}

module.exports = { createDB, readDB, updateDB, deleteDB };