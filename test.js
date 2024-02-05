const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://abc:abc@cluster0.tfhjsuj.mongodb.net/`

const testClient = new MongoClient(uri);

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