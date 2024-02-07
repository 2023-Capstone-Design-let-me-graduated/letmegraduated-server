const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`

const testClient = new MongoClient(uri);

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

const testCreateUser = async() => {
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
    const result = await userdb.insertOne(testUser);
    console.log(result);

  } catch (err) {
    console.error(err);
  } finally {
    await userDataClient.close();
  }
}
createUser();

// 콘솔 유저 전부 출력하기
async function printAllUsers() {
    try {
      await testClient.connect();
      
      const userdb = testClient.db("userData").collection("users");
      const cursor = userdb.find();
      
      for await(const doc of cursor) {
        console.log(doc);
      }
    } catch (err) {
      console.error(err);
    } finally {
      await testClient.close();
    }
  }
  
  printAllUsers();

  module.exports={createUser, };