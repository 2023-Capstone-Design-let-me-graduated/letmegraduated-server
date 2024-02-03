// 몽고디비랑 연결해서 user데이터 뽑아봤음.
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");
// // Replace the uri string with your connection string.

const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.tfhjsuj.mongodb.net/?retryWrites=true&w=majority`;

const client1 = new MongoClient(uri); // 클라이언트는 내가 조종할 수 있는 db 개수 늘림.
const client2 = new MongoClient(uri);

async function run() {
  try {
    const database = client1.db("userData");
    const movies = database.collection("users");
    const database2 = client2.db("timeTable");
    const movies2 = database2.collection("2019_1");
    const l = [[], [], [], []];

    const subjects = movies2.find();
    for await (const subject of subjects) {
      l[0].push(subject);
      console.log(subject);
    }
    const movie = await movies.insertOne({ name: "firstuser", article: l });

    console.log(movie);
  } finally {
    await client1.close();
    await client2.close();
  }
}

// crud 만들어야함 위에는 예시일 뿐이다.

run().catch(console.dir);

module.exports={run};