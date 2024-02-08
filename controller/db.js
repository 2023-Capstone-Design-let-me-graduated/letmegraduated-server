require("dotenv").config();
const { MongoClient } = require("mongodb");

/**
 * createDB(); 함수
 * @param {object} newUser 
 * 회원 가입 시 유저 컬렉션에 도큐먼트 생성하는 코드
 */
const createDB = async (newUser) => {
  const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/`;
  const dbName = "userData";
  const collectionName = "users";
  const client = new MongoClient(uri);
  try {
    const create = client.db(dbName).collection(collectionName);
    await create.insertOne(newUser);
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
 * @param {object} condition
 * @param {boolean} many
 * @return {object}
 * 유저 데이터, 타임테이블(전공, 교양), exam(영어시험)을 전체 콜렉션을 가져오는 DB
 * condition은 객체이다.
 * number가 1이 아니면 하나만 반환, 기본값은 전체 가져오기
 */
const readDB = async (dbName, collectionName, condition = "",many = true) => {
  const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/`;
  const client = new MongoClient(uri);
  const database = client.db(dbName);
  const coll = database.collection(collectionName);
  try {
    if (many === true) {
      const result = await coll.find(condition).toArray();
      return result;
    } else {
      const result = await coll.findOne(condition);
      return result;
    }
  }
  catch {
    throw new Error(err);
  }
  finally {
    client.close();
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
    await coll.updateOne(
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
    await coll.deleteOne(condition);
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}

module.exports = { createDB, readDB, updateDB, deleteDB };